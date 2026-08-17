import Link from "next/link";
import { categoriesApi } from "@/lib/api";

export default async function AdminCategoriesPage() {
  const categories = await categoriesApi.list({ revalidate: 0 });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Categories</h1>
        <Link
          href="/admin/categories/new"
          className="bg-accent px-4 py-2 text-xs font-medium uppercase tracking-[0.08em] text-accent-foreground transition-opacity hover:opacity-90"
        >
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
