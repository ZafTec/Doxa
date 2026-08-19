import Link from "next/link";
import { categoriesApi } from "@/lib/api";
import { buttonVariants } from "@/app/components/ui/button";

export default async function AdminCategoriesPage() {
  const categories = await categoriesApi.list({ revalidate: 0 });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Categories</h1>
        <Link href="/admin/categories/new" className={buttonVariants({ size: "xs" })}>
          New category
        </Link>
      </div>

      {categories.length === 0 ? (
        <p className="text-sm text-muted-foreground">No categories yet.</p>
      ) : (
        <ul className="divide-y divide-border border-y border-border">
          {categories.map((category) => (
            <li key={category.id} className="py-3 text-sm">
              {category.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
