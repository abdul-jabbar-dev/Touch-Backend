/*
  Warnings:

  - The `emailValidatorCode` column on the `credentials` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('Active', 'Deactive', 'Verifying');

-- AlterTable
ALTER TABLE "credentials" ADD COLUMN     "accountStatus" "AccountStatus" NOT NULL DEFAULT 'Verifying',
ALTER COLUMN "password" DROP NOT NULL,
DROP COLUMN "emailValidatorCode",
ADD COLUMN     "emailValidatorCode" INTEGER;
