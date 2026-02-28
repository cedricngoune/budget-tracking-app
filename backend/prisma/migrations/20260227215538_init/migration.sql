-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('income', 'expense');

-- CreateEnum
CREATE TYPE "RecurringFrequency" AS ENUM ('daily', 'weekly', 'monthly', 'yearly');

-- CreateEnum
CREATE TYPE "BankSlug" AS ENUM ('societe_generale', 'hello_bank', 'livret_a', 'boursorama', 'credit_agricole', 'bnp_paribas', 'autre');

-- CreateEnum
CREATE TYPE "CategorySlug" AS ENUM ('salaire', 'alimentaire', 'epargne', 'vente', 'investissement', 'transport', 'facture', 'abonnement', 'loyer', 'achats_perso', 'achat_maison', 'sante', 'loisir', 'autre');

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "currency" VARCHAR(10) NOT NULL DEFAULT 'EUR',
    "description" VARCHAR(500) NOT NULL,
    "date" VARCHAR(10),
    "bank" "BankSlug" NOT NULL,
    "category" "CategorySlug" NOT NULL,
    "isPending" BOOLEAN NOT NULL DEFAULT false,
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "recurringFrequency" "RecurringFrequency",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Transaction_isPending_createdAt_idx" ON "Transaction"("isPending", "createdAt");

-- CreateIndex
CREATE INDEX "Transaction_type_bank_category_idx" ON "Transaction"("type", "bank", "category");

-- CreateIndex
CREATE INDEX "Transaction_date_idx" ON "Transaction"("date");

-- CreateIndex
CREATE INDEX "Transaction_isRecurring_idx" ON "Transaction"("isRecurring");
