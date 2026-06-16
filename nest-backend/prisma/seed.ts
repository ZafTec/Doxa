/**
 * Database seed. Run with: `bun run prisma/seed.ts` (from nest-backend/).
 *
 * Populates Category, Item, ItemVariant, and Asset tables with editorial
 * watch data so the storefront has something realistic to render in dev.
 *
 * Idempotent-ish: clears Asset → ItemVariant → Item → Category in order
 * before reinserting, so repeated runs converge on the same state without
 * accumulating duplicates.
 */

import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

type SeedVariant = {
  name: string;
  description: string;
  color: string;
  /** Minor units (cents). */
  price: number;
  stockQuantity: number;
  assetUrls: string[];
};

type SeedItem = {
  brand: string;
  category: string;
  description: string;
  variants: SeedVariant[];
};

const CATEGORIES = ["Dive", "Dress", "Field", "Chronograph", "Pilot"];

// Stitch-generated placeholder URLs, reused as Asset.url so the catalog
// renders real images in dev. Replace with Cloudinary URLs in prod seed.
const IMG = {
  blackBay58:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBm4LhKjXaZsBVXpm79g7U8AAowRzIbbq6nxu2HqvZ_KD-R2PsXDJhCPI0ZzBHQAGR6cYRFFI0q5r4nDHbrBTPe33kkbwaCEL-sEkq3wFjmn2o4z9jB3rEh3zc-QL6bXNoH_SBe-DscGHQhu1YSYtfV8IR6w5Ep6g4YltHmOZBYNV2_sA-CIOismnmWvs9Pm50UN96RdJWJmRR2asvDFXuMpul7JpCkP-2pO1XJHUBvDNlIwiwQOvDXMSRVTa4S11f8U-S3tM4Sd7I",
  subOrange:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuANYl3YFNqDSD6dcpFCPb335-MIuHUumN7TsDeE8BM3kXo4HCI6BdlXCH-QLcOlPiXD4D5aji8HN9e-pKITj2xiAg7sO8kSCx26EzrU3fGLGUBG4f0IjP28EHi5s5Xn_2J81MRmYI_lRcWxGlsE_Mgx6ZhqkWmIVlWF45tC0TWTsW6SDivauPKqZv77HYkRT9uPkaX5wjkGvx3y_ru6HpSN_vYB0Jm7d_tuT21XkCCqFWReYHh6bbzBpkaZb_DML419XqjprkEvydE",
  pelagos:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAbDvI6ea5wwszxag4PcebexXnzu91RBJp8A2rsuYJifprrKQjmV6u63SdhMMDRdl8XMqs7iF9wgA3jtWmv00jNclidL21Uvnx9QyO7wVx27MVSKlMZBz76A8yrFz4dbyJh7gzfpBvbY8SIZuYutM7cJm4KZlUx9QUJ8oFXOh4YlE_9CkI9kv9Xe1lJ2tpE7NPq_et2tZiB-E3OdTZYb0euI5cYcgMV9t0Je4PJznNPu3SY_ySA5yZSFnJDUEu6Pu76yu4IEQMGxFo",
  khakiField:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAqPayQPgWV8GYnygVwN8CL7vkeMnHr-Wis7wD4Kl2deseC-tzx2cRB3Kdpbi7fcJ_wXXN2zNefe5jXz7-6COSKU9QczvF-7O7-5X1PU6dWZrZAK9-5s1etttX3JR-GudHn6wZRjkmu14XVKn1whS2vHg0T2z-YHYwWFbIaDKZFp-Qu_g3uTp6Q9SYHAm-xKi7zPHp-cSJWB_EhpeyFFJenF2XBRlduRKelbHi8oG59EA4lqD-yEBC03nq-HmE89vFkcLah0H8D9Ew",
  hydroconquest:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBtv48c6BtpxLuTonSxeNsze8M7EvcMyjbOMSqq-cnn8JZjFiI8bg_KfYO1zwX-cmmziJeQZc3VMC974SelQ8MVlM4xGI2OCNkP3CfgnmCRNLuH5O_arPml0XxE_RwNKjTXIfS57QaWwz_I-9UqhBlQHKdA18Hd6acHA3ClooFevxVw-fDDyGwWYYZW26pRdX1rrDTowTlSQCKVSRDqpqy2kTaM0syYE5IB8OKbBob5yjGNBAZs4CCL-vVbP81xS5ncvh5S6FU_uMI",
  bigCrown:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAAe539V6dVNcmewN6CQlskUQFyBPIMnGIittvPOrNxFbd6ZqdFPywGGrPb4dA_ezcBUJ8ENADssxE_bc9dsnO-Y4dhKzANRsaeHJD2mCPdrEdRxFsqDtikweI9NYnqVrhsA6z0uVK79f13wGzmIhfj2YGmigfe7wDfBuGKc6e-NHYEe78loqLQn54KvQuQdj2YwfbrfxbQKJu4dIrgrXUxr_wBYUmzZ45gntCyj2g24XMlqp_RjlveYaukd89ep_oiB9mwwLDau7s",
  intramatic:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAhJAAtrtxrz_UqMP9woOo0rMrk1qnisZAH_btfqa63mJoE5OFfFH0i07i4BaARjbACNhIFOccCGKKzOzxsuEWUE2Xce050F847v0_FNlNi44IZya9WWTF0SQxPixDQdw0atNVRSQxdyB0kT72atfKyf6EhXtLAOV1sC7Qwmj-tqFSLxMUVM0xditO_7neEzGtyibm_qTA5mfviO2_cdymedsGPvQKDnQKzlKHTtQM5vzf2lNLPuED_dCSIqJsgVGUA9mS0r7Elzi0",
  subBlack:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuANYl3YFNqDSD6dcpFCPb335-MIuHUumN7TsDeE8BM3kXo4HCI6BdlXCH-QLcOlPiXD4D5aji8HN9e-pKITj2xiAg7sO8kSCx26EzrU3fGLGUBG4f0IjP28EHi5s5Xn_2J81MRmYI_lRcWxGlsE_Mgx6ZhqkWmIVlWF45tC0TWTsW6SDivauPKqZv77HYkRT9uPkaX5wjkGvx3y_ru6HpSN_vYB0Jm7d_tuT21XkCCqFWReYHh6bbzBpkaZb_DML419XqjprkEvydE",
  turtle:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCrMl2RHTkzHnxCpqhy5zA1NJTIH8EoGC0jCZL6hH12ljQaf7EJaa__pdoh48dhnqF9w9rIakdFtHsDTdI6aHHI9_XXsSTs4OO6zvEBv5pPKw2-EsFWEphe9wJoOgqdwMhIzDHJbDVKBl3J8SrXiCoLpJEt_pP0nt2Kt1yBH30fTraZGxlBZDisc7kGM49k4HsVoC_EQqavMqMJ6eL4K2iRptKHbw5FSPjUKIIx69_H-Kyk5hIjrQ2uHphmxnyLAhhyENvvfQH-0lI",
};

const ITEMS: SeedItem[] = [
  {
    brand: "Tudor",
    category: "Dive",
    description: "Heritage diver inspired by 1950s archive references.",
    variants: [
      {
        name: "Black Bay 58",
        description: "39mm heritage diver with Tudor's MT5402 manufacture calibre.",
        color: "Black",
        price: 395_000,
        stockQuantity: 6,
        assetUrls: [IMG.blackBay58],
      },
      {
        name: "Black Bay 58 Blue",
        description: "Same 39mm case with a deep navy dial and matching bezel.",
        color: "Blue",
        price: 405_000,
        stockQuantity: 4,
        assetUrls: [IMG.blackBay58],
      },
      {
        name: "Black Bay 58 Burgundy",
        description: "Limited burgundy bezel pairing on the 39mm Black Bay 58 case.",
        color: "Burgundy",
        price: 415_000,
        stockQuantity: 2,
        assetUrls: [IMG.blackBay58],
      },
    ],
  },
  {
    brand: "Tudor",
    category: "Dive",
    description: "Modern titanium diver built for professional use.",
    variants: [
      {
        name: "Pelagos FXD",
        description: "Titanium dive watch developed with the French Marine Nationale.",
        color: "Blue",
        price: 410_000,
        stockQuantity: 3,
        assetUrls: [IMG.pelagos],
      },
    ],
  },
  {
    brand: "Doxa",
    category: "Dive",
    description: "Iconic cushion-cased dive watch with high-contrast dial.",
    variants: [
      {
        name: "SUB 300 Professional",
        description: "300m dive watch with the original Professional orange dial.",
        color: "Orange",
        price: 249_000,
        stockQuantity: 8,
        assetUrls: [IMG.subOrange],
      },
      {
        name: "SUB 300 Sharkhunter",
        description: "Stealth Sharkhunter variant with a matte black dial.",
        color: "Black",
        price: 249_000,
        stockQuantity: 5,
        assetUrls: [IMG.subBlack],
      },
    ],
  },
  {
    brand: "Hamilton",
    category: "Field",
    description: "Mil-spec field watch heritage in a contemporary case.",
    variants: [
      {
        name: "Khaki Field Mechanical",
        description: "Hand-wound 38mm field watch with H-50 movement.",
        color: "Green",
        price: 59_500,
        stockQuantity: 12,
        assetUrls: [IMG.khakiField],
      },
      {
        name: "Khaki Field Mechanical Black",
        description: "Same 38mm Khaki Field with a stealth black PVD case.",
        color: "Black",
        price: 62_500,
        stockQuantity: 10,
        assetUrls: [IMG.khakiField],
      },
    ],
  },
  {
    brand: "Hamilton",
    category: "Chronograph",
    description: "Vintage-inspired panda-dial chronograph.",
    variants: [
      {
        name: "Intra-Matic Chronograph H",
        description: "Reverse-panda chronograph with column-wheel architecture.",
        color: "White",
        price: 219_500,
        stockQuantity: 3,
        assetUrls: [IMG.intramatic],
      },
    ],
  },
  {
    brand: "Longines",
    category: "Dive",
    description: "Modern sport diver with a refined silhouette.",
    variants: [
      {
        name: "HydroConquest 41mm",
        description: "300m diver with ceramic bezel and a sunray-finished dial.",
        color: "Blue",
        price: 170_000,
        stockQuantity: 7,
        assetUrls: [IMG.hydroconquest],
      },
      {
        name: "HydroConquest 41mm Black",
        description: "Same case with a deep black dial and black bezel.",
        color: "Black",
        price: 170_000,
        stockQuantity: 7,
        assetUrls: [IMG.hydroconquest],
      },
    ],
  },
  {
    brand: "Oris",
    category: "Dress",
    description: "Heritage pointer-date design from the 1930s archive.",
    variants: [
      {
        name: "Big Crown Pointer Date",
        description: "40mm pointer-date with a coin-edge bezel and bronze accents.",
        color: "Brown",
        price: 210_000,
        stockQuantity: 4,
        assetUrls: [IMG.bigCrown],
      },
    ],
  },
  {
    brand: "Seiko",
    category: "Dive",
    description: "Cushion-cased professional diver.",
    variants: [
      {
        name: "Prospex Turtle",
        description: "Day-date dive watch with 200m water resistance.",
        color: "Black",
        price: 49_500,
        stockQuantity: 15,
        assetUrls: [IMG.turtle],
      },
      {
        name: "Prospex Turtle PADI",
        description: "PADI edition of the Turtle with red-blue PADI accents.",
        color: "Blue",
        price: 54_500,
        stockQuantity: 9,
        assetUrls: [IMG.turtle],
      },
    ],
  },
];

async function main() {
  console.log("⟳ wiping existing seed data…");
  await prisma.asset.deleteMany();
  await prisma.itemVariant.deleteMany();
  await prisma.item.deleteMany();
  await prisma.category.deleteMany();

  console.log("⟳ inserting categories…");
  const categoryRows = await Promise.all(
    CATEGORIES.map((name) => prisma.category.create({ data: { name } })),
  );
  const categoryByName = new Map(categoryRows.map((c) => [c.name, c]));

  console.log("⟳ inserting items + variants + assets…");
  let itemCount = 0;
  let variantCount = 0;
  let assetCount = 0;

  for (const it of ITEMS) {
    const cat = categoryByName.get(it.category);
    if (!cat) throw new Error(`Unknown category in seed data: ${it.category}`);

    const item = await prisma.item.create({
      data: {
        brand: it.brand,
        description: it.description,
        categoryId: cat.id,
      },
    });
    itemCount++;

    for (const v of it.variants) {
      const variant = await prisma.itemVariant.create({
        data: {
          itemId: item.id,
          color: v.color,
          price: v.price,
          stockQuantity: v.stockQuantity,
          name: v.name,
          description: v.description,
        },
      });
      variantCount++;

      if (v.assetUrls.length > 0) {
        const { count } = await prisma.asset.createMany({
          data: v.assetUrls.map((url) => ({ url, itemVariantId: variant.id })),
        });
        assetCount += count;
      }
    }
  }

  console.log(
    `✓ seed complete — ${categoryRows.length} categories, ${itemCount} items, ${variantCount} variants, ${assetCount} assets.`,
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
