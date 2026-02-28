/*
  Warnings:

  - Changed the type of `bank` on the `Transaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `category` on the `Transaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "bank",
ADD COLUMN     "bank" VARCHAR(50) NOT NULL,
DROP COLUMN "category",
ADD COLUMN     "category" VARCHAR(50) NOT NULL;

-- DropEnum
DROP TYPE "BankSlug";

-- DropEnum
DROP TYPE "CategorySlug";

-- CreateIndex
CREATE INDEX "Transaction_type_bank_category_idx" ON "Transaction"("type", "bank", "category");
