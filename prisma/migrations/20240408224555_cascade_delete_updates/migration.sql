-- DropForeignKey
ALTER TABLE "IncidentUpdate" DROP CONSTRAINT "IncidentUpdate_incidentId_fkey";

-- AddForeignKey
ALTER TABLE "IncidentUpdate" ADD CONSTRAINT "IncidentUpdate_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "Incident"("id") ON DELETE CASCADE ON UPDATE CASCADE;
