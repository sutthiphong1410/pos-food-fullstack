/*
  Warnings:

  - You are about to drop the `foodTyepe` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "foodTyepe";

-- CreateTable
CREATE TABLE "FoodType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "remarks" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'use',

    CONSTRAINT "FoodType_pkey" PRIMARY KEY ("id")
);
