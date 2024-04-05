/*
  Warnings:

  - Added the required column `type` to the `Incident` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "IncidentType" AS ENUM ('MAINTENANCE', 'INCIDENT');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "IncidentStatus" ADD VALUE 'SCHEDULED';
ALTER TYPE "IncidentStatus" ADD VALUE 'IN_PROGRESS';
ALTER TYPE "IncidentStatus" ADD VALUE 'COMPLETED';

-- AlterTable
ALTER TABLE "Incident" ADD COLUMN     "type" "IncidentType" NOT NULL;
