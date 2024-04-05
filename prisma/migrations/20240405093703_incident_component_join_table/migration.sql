-- DropForeignKey
ALTER TABLE "Incident" DROP CONSTRAINT "Incident_componentId_fkey";

-- CreateTable
CREATE TABLE "IncidentComponent" (
    "componentId" UUID NOT NULL,
    "incidentId" UUID NOT NULL,

    CONSTRAINT "IncidentComponent_pkey" PRIMARY KEY ("componentId","incidentId")
);

-- AddForeignKey
ALTER TABLE "IncidentComponent" ADD CONSTRAINT "IncidentComponent_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "Component"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncidentComponent" ADD CONSTRAINT "IncidentComponent_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "Incident"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
