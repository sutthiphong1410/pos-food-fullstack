/*
  Warnings:

  - Changed the type of `tableNo` on the `SaleTemp` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "SaleTempDetail" DROP CONSTRAINT "SaleTempDetail_foodSizeId_fkey";

-- DropForeignKey
ALTER TABLE "SaleTempDetail" DROP CONSTRAINT "SaleTempDetail_tasteId_fkey";

-- AlterTable
ALTER TABLE "SaleTemp" DROP COLUMN "tableNo",
ADD COLUMN     "tableNo" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "SaleTempDetail" ALTER COLUMN "tasteId" DROP NOT NULL,
ALTER COLUMN "foodSizeId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "SaleTempDetail" ADD CONSTRAINT "SaleTempDetail_tasteId_fkey" FOREIGN KEY ("tasteId") REFERENCES "Taste"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleTempDetail" ADD CONSTRAINT "SaleTempDetail_foodSizeId_fkey" FOREIGN KEY ("foodSizeId") REFERENCES "FoodSize"("id") ON DELETE SET NULL ON UPDATE CASCADE;
