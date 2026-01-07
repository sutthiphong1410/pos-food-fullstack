/*
  Warnings:

  - You are about to drop the column `remarks` on the `FoodType` table. All the data in the column will be lost.
  - Added the required column `remark` to the `FoodType` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FoodType" DROP COLUMN "remarks",
ADD COLUMN     "remark" TEXT NOT NULL;
