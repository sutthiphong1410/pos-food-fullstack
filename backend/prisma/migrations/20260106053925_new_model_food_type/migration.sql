-- CreateTable
CREATE TABLE "foodTyepe" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "remarks" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'use',

    CONSTRAINT "foodTyepe_pkey" PRIMARY KEY ("id")
);
