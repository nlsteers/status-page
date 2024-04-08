-- DropForeignKey
ALTER TABLE "IncidentComponent" DROP CONSTRAINT "IncidentComponent_componentId_fkey";

-- DropForeignKey
ALTER TABLE "IncidentComponent" DROP CONSTRAINT "IncidentComponent_incidentId_fkey";

-- AddForeignKey
ALTER TABLE "IncidentComponent" ADD CONSTRAINT "IncidentComponent_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "Component"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncidentComponent" ADD CONSTRAINT "IncidentComponent_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "Incident"("id") ON DELETE CASCADE ON UPDATE CASCADE;
