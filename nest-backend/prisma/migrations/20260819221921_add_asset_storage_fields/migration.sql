-- DropForeignKey
ALTER TABLE "Asset" DROP CONSTRAINT "Asset_itemVariantId_fkey";

-- AlterTable
ALTER TABLE "Asset" ADD COLUMN     "contentType" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "etag" TEXT,
ADD COLUMN     "key" TEXT,
ADD COLUMN     "originalName" TEXT,
ADD COLUMN     "position" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "size" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Asset_key_key" ON "Asset"("key");

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_itemVariantId_fkey" FOREIGN KEY ("itemVariantId") REFERENCES "ItemVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

