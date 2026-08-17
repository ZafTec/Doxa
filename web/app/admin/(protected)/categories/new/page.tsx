import { CategoryForm } from "./category-form";

export default function NewCategoryPage() {
  return (
    <div className="max-w-lg">
      <h1 className="mb-8 text-2xl font-semibold tracking-tight">New category</h1>
      <CategoryForm />
    </div>
  );
}
