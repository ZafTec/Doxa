import { notFound } from "next/navigation";
import { ApiError, itemsApi } from "@/lib/api";
import { Breadcrumbs } from "@/app/components/pdp/breadcrumbs";
import { ProductDetails } from "@/app/components/pdp/product-details";
import { Related } from "@/app/components/pdp/related";

type Params = Promise<{ id: string }>;

export default async function ProductPage({ params }: { params: Params }) {
  const { id } = await params;

  const details = await itemsApi.details(id).catch((err) => {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  });

  if (!details) notFound();

  const defaultVariant =
    details.variants.find((variant) => variant.stockQuantity > 0) ?? details.variants[0];
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
          { label: defaultVariant?.name ?? details.brand },
        ]}
      />

      <ProductDetails details={details} />

      <Related items={related} />
    </main>
  );
}
