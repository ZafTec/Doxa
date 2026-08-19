import Link from "next/link";
import { itemsApi } from "@/lib/api";
import { buttonVariants } from "@/app/components/ui/button";
import { Eyebrow, eyebrowBaseClassName } from "@/app/components/ui/eyebrow";

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
        <p className="text-sm text-muted-foreground">No items yet.</p>
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
                <td className="py-3 pr-4 tabular-nums text-muted-foreground">
                  {item.itemVariants?.length ?? 0}
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
