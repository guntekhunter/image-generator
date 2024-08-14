-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "image" TEXT,
    "description" TEXT,
    "type" TEXT,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);
