import { itemsApi } from "@/lib/api";
import { VariantForm } from "./variant-form";

export default async function NewItemVariantPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await itemsApi.details(id, { revalidate: 0 });

  return (
    <div className="max-w-lg">
      <h1 className="mb-1 text-2xl font-semibold tracking-tight">New variant</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        {item.brand} · {item.description}
      </p>
      <VariantForm itemId={id} />
    </div>
  );
}
