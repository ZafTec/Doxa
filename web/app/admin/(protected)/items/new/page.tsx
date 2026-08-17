import { categoriesApi } from "@/lib/api";
import { ItemForm } from "./item-form";

export default async function NewItemPage() {
  const categories = await categoriesApi.list({ revalidate: 0 });

  return (
    <div className="max-w-lg">
      <h1 className="mb-8 text-2xl font-semibold tracking-tight">New item</h1>
      <ItemForm categories={categories} />
    </div>
  );
}
