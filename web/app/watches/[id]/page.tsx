import { notFound } from "next/navigation";
import { ApiError, itemsApi } from "@/lib/api";
import { defaultVariant } from "@/lib/util/item";
import { Breadcrumbs } from "@/app/components/pdp/breadcrumbs";
import { Gallery } from "@/app/components/pdp/gallery";
import { PurchasePanel } from "@/app/components/pdp/purchase-panel";
import { SpecList } from "@/app/components/pdp/spec-list";
import { Related } from "@/app/components/pdp/related";

type Params = Promise<{ id: string }>;

export default async function ProductPage({ params }: { params: Params }) {
  const { id } = await params;

  const item = await itemsApi.byId(id).catch((err) => {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  });

  if (!item) notFound();

  const variant = defaultVariant(item);

  const related = await itemsApi
    .list({
      brand: item.brand ? [item.brand] : undefined,
      pageNumber: 0,
      pageSize: 5,
    })
    .then((res) => res.data.filter((i) => i.id !== item.id).slice(0, 4))
    .catch(() => []);

  return (
    <main className="mx-auto max-w-[1440px] px-6 pt-12 pb-24 md:px-12 lg:px-24">
      <Breadcrumbs
        crumbs={[
          { label: "Watches", href: "/" },
          ...(item.category?.name
            ? [{ label: item.category.name, href: `/?category=${encodeURIComponent(item.category.name)}` }]
            : []),
          { label: item.brand },
        ]}
      />

      <div className="grid grid-cols-1 gap-16 lg:grid-cols-[60%_40%] lg:gap-24">
        <Gallery brand={item.brand} />
        <div className="space-y-12">
          <PurchasePanel item={item} />
          <SpecList item={item} variant={variant} />
        </div>
      </div>

      <Related items={related} />
    </main>
  );
}
