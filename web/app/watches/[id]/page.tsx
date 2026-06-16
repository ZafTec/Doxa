import { notFound } from "next/navigation";
import { ApiError, itemsApi } from "@/lib/api";
import { Breadcrumbs } from "@/app/components/pdp/breadcrumbs";
import { Gallery } from "@/app/components/pdp/gallery";
import { PurchasePanel } from "@/app/components/pdp/purchase-panel";
import { SpecList } from "@/app/components/pdp/spec-list";
import { Related } from "@/app/components/pdp/related";

type Params = Promise<{ id: string }>;

export default async function ProductPage({ params }: { params: Params }) {
  const { id } = await params;

  const details = await itemsApi.details(id).catch((err) => {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  });

  if (!details) notFound();

  const variants = details.variants?.itemVariants ?? [];
  const categoryName = details.category?.name;

  const related = await itemsApi
    .list({
      brand: [details.brand],
      pageNumber: 0,
      pageSize: 5,
    })
    .then((res) => res.data.filter((i) => i.id !== id).slice(0, 4))
    .catch(() => []);

  return (
    <main className="mx-auto max-w-[1440px] px-6 pt-12 pb-24 md:px-12 lg:px-24">
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
          { label: details.brand },
        ]}
      />

      <div className="grid grid-cols-1 gap-16 lg:grid-cols-[60%_40%] lg:gap-24">
        <Gallery brand={details.brand} assets={details.assets} placeholderKey={details.id} />
        <div className="space-y-12">
          <PurchasePanel
            itemId={details.id}
            brand={details.brand}
            name={details.name}
            description={details.description}
            price={details.price}
            variants={variants}
          />
          <SpecList brand={details.brand} variants={variants} />
        </div>
      </div>

      <Related items={related} />
    </main>
  );
}
