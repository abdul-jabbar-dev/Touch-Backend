-- AlterTable
ALTER TABLE "credentials" ADD COLUMN     "emailValidatorCode" TEXT,
ADD COLUMN     "emailValidatorCodeExp" TIMESTAMP(3);
