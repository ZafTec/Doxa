import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ApiError, itemsApi } from "@/lib/api";
import { Breadcrumbs } from "@/app/components/pdp/breadcrumbs";
import { ProductDetails } from "@/app/components/pdp/product-details";
import { Related } from "@/app/components/pdp/related";
import { absoluteUrl, siteConfig } from "@/lib/seo/config";
import { truncateForMeta } from "@/lib/seo/text";
import { DEFAULT_CURRENCY } from "@/lib/util/money";
import type { ItemDetails, ItemDetailsVariant } from "@/lib/api";

type Params = Promise<{ id: string }>;

/** Same pick the page body uses - kept in one place so metadata and markup can't disagree. */
function pickDefaultVariant(details: ItemDetails): ItemDetailsVariant | undefined {
  return details.variants.find((variant) => variant.stockQuantity > 0) ?? details.variants[0];
}

async function loadDetails(id: string): Promise<ItemDetails | null> {
  return itemsApi.details(id).catch((err) => {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  });
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  // Same call as the page body below - Next dedupes identical fetches within
  // one request, so this doesn't cost a second round-trip to the API.
  const details = await loadDetails(id);
  if (!details) return {};

  const variant = pickDefaultVariant(details);
  const title = variant ? `${details.brand} ${variant.name}` : details.brand;
  const rawDescription = variant?.description?.trim() || details.description.trim();
  const description = truncateForMeta(`${title} — ${rawDescription}`);
  const image = variant?.assets[0];
  const url = absoluteUrl(`/watches/${id}`);

  const keywords = Array.from(
    new Set(
      [details.brand, details.category.name, variant?.color, "watch", "watches"].filter(
        (v): v is string => Boolean(v),
      ),
    ),
  );

  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: image
        ? [{ url: image, width: 1200, height: 1200, alt: title }]
        : [{ url: absoluteUrl(siteConfig.ogImagePath), width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image ?? absoluteUrl(siteConfig.ogImagePath)],
    },
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { id } = await params;

  const details = await loadDetails(id);

  if (!details) notFound();

  const defaultVariant = pickDefaultVariant(details);
  const categoryName = details.category.name;

  const related = await itemsApi
    .list({
      brand: [details.brand],
      pageNumber: 0,
      pageSize: 5,
    })
    .then((res) => res.data.filter((i) => i.id !== id).slice(0, 4))
    .catch(() => []);

  return (
    <main className="mx-auto max-w-[1440px] px-6 pt-12 pb-24 md:px-12 lg:px-20">
      <ProductJsonLd details={details} variant={defaultVariant} id={id} />

      <Breadcrumbs
        crumbs={[
          { label: "Watches", href: "/" },
          ...(categoryName
            ? [
                {
                  label: categoryName,
                  href: `/?category=${encodeURIComponent(categoryName)}`,
                },
              ]
            : []),
          { label: defaultVariant?.name ?? details.brand },
        ]}
      />

      <ProductDetails details={details} />

      <Related items={related} />
    </main>
  );
}

/**
 * schema.org Product markup for rich search results (price, availability,
 * image). `</script>`-escaped since brand/description ultimately come from
 * admin input, not hardcoded copy.
 */
function ProductJsonLd({
  details,
  variant,
  id,
}: {
  details: ItemDetails;
  variant: ItemDetailsVariant | undefined;
  id: string;
}) {
  if (!variant) return null;

  const json = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${details.brand} ${variant.name}`,
    description: variant.description || details.description,
    image: variant.assets.length > 0 ? variant.assets : [absoluteUrl(siteConfig.ogImagePath)],
    sku: variant.id,
    brand: { "@type": "Brand", name: details.brand },
    category: details.category.name,
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/watches/${id}`),
      priceCurrency: DEFAULT_CURRENCY,
      price: (variant.price / 100).toFixed(2),
      availability:
        variant.stockQuantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json).replace(/</g, "\\u003c") }}
    />
  );
}
