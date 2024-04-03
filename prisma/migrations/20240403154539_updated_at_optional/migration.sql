-- AlterTable
ALTER TABLE "Component" ALTER COLUMN "updatedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "IncidentUpdate" ALTER COLUMN "updatedAt" DROP NOT NULL;
