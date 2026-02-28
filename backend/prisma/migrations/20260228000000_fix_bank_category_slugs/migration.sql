-- Normalise les slugs bank : underscores → tirets
UPDATE "Transaction" SET "bank" = 'societe-generale'  WHERE "bank" = 'societe_generale';
UPDATE "Transaction" SET "bank" = 'hello-bank'         WHERE "bank" = 'hello_bank';
UPDATE "Transaction" SET "bank" = 'livret-a'           WHERE "bank" = 'livret_a';
UPDATE "Transaction" SET "bank" = 'credit-agricole'    WHERE "bank" = 'credit_agricole';
UPDATE "Transaction" SET "bank" = 'bnp-paribas'        WHERE "bank" = 'bnp_paribas';

-- Normalise les slugs category : underscores → tirets
UPDATE "Transaction" SET "category" = 'achats-perso'  WHERE "category" = 'achats_perso';
UPDATE "Transaction" SET "category" = 'achat-maison'  WHERE "category" = 'achat_maison';