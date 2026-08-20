import Link from "next/link";
import { itemsApi } from "@/lib/api";
import { buttonVariants } from "@/app/components/ui/button";
import { Eyebrow, eyebrowBaseClassName } from "@/app/components/ui/eyebrow";
import { AdminEmptyState } from "@/app/admin/components/empty-state";

export default async function AdminItemsPage() {
  const { data: items } = await itemsApi.list({ pageSize: 50 }, { revalidate: 0 });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Items</h1>
        <Link href="/admin/items/new" className={buttonVariants({ size: "xs" })}>
          New item
        </Link>
      </div>

      {items.length === 0 ? (
        <AdminEmptyState
          title="No items yet."
          body={'Use "New item" above to start the catalog.'}
        />
      ) : (
        <table className="w-full border-collapse text-sm">
          <thead>
            <Eyebrow as="tr" className="border-b border-border text-left">
              <th className="py-3 pr-4">Brand</th>
              <th className="py-3 pr-4">Description</th>
              <th className="py-3 pr-4">Variants</th>
              <th className="py-3 pr-4" />
            </Eyebrow>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-border">
                <td className="py-3 pr-4 font-medium">{item.brand}</td>
                <td className="py-3 pr-4 text-muted-foreground">{item.description}</td>
                <td className="py-3 pr-4 text-muted-foreground">
                  {item.itemVariants?.length ? (
                    <div className="flex flex-wrap gap-x-3 gap-y-1">
                      {item.itemVariants.map((variant) => (
                        <Link
                          key={variant.id}
                          href={`/admin/items/${item.id}/variants/${variant.id}/assets`}
                          className="underline decoration-border decoration-1 underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground"
                        >
                          {variant.color}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    "0"
                  )}
                </td>
                <td className="py-3 pr-4 text-right">
                  <Link
                    href={`/admin/items/${item.id}/variants/new`}
                    className={
                      eyebrowBaseClassName +
                      " text-muted-foreground transition-colors hover:text-foreground"
                    }
                  >
                    Add variant
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
