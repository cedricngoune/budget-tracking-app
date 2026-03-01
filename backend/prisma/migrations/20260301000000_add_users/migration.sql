-- CreateTable
CREATE TABLE "User" (
    "id"        TEXT NOT NULL,
    "name"      VARCHAR(50) NOT NULL,
    "color"     VARCHAR(20) NOT NULL,
    "banks"     TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- Insert legacy user to backfill existing transactions
INSERT INTO "User" ("id", "name", "color", "banks", "createdAt", "updatedAt")
VALUES ('legacy-user-000', 'Compte principal', 'amber', ARRAY[]::TEXT[], NOW(), NOW());

-- Add userId column as nullable first (for backfill)
ALTER TABLE "Transaction" ADD COLUMN "userId" TEXT;

-- Backfill existing transactions with legacy user
UPDATE "Transaction" SET "userId" = 'legacy-user-000' WHERE "userId" IS NULL;

-- Set NOT NULL constraint
ALTER TABLE "Transaction" ALTER COLUMN "userId" SET NOT NULL;

-- Add foreign key constraint
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateIndex
CREATE INDEX "Transaction_userId_idx" ON "Transaction"("userId");