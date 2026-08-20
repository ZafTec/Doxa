import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { itemsApi } from "@/lib/api";
import { assetsAdminApi } from "@/lib/api/endpoints/assets-admin";
import { AssetManager } from "./asset-manager";

export default async function VariantAssetsPage({
  params,
}: {
  params: Promise<{ id: string; variantId: string }>;
}) {
  const { id, variantId } = await params;
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const [item, assets] = await Promise.all([
    itemsApi.details(id, { revalidate: 0 }),
    assetsAdminApi.byVariant(variantId, cookieHeader),
  ]);

  const variant = item.variants.find((v) => v.id === variantId);
  if (!variant) notFound();

  return (
    <div className="max-w-2xl">
      <h1 className="mb-1 text-2xl font-semibold tracking-tight">{variant.name}</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        {item.brand} · {variant.color}
      </p>
      <AssetManager itemVariantId={variantId} initialAssets={assets} />
    </div>
  );
}
