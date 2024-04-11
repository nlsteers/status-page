-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateEnum
CREATE TYPE "SystemStatus" AS ENUM ('OPERATIONAL', 'DEGRADED', 'MAINTENANCE', 'PARTIAL_OUTAGE', 'MAJOR_OUTAGE');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('INVESTIGATING', 'IDENTIFIED', 'UPDATE', 'MONITORING', 'RESOLVED', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "MaintenanceStatus" AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'UPDATE', 'COMPLETED', 'POSTPONED');

-- CreateEnum
CREATE TYPE "IncidentStatus" AS ENUM ('INVESTIGATING', 'UPDATE', 'IDENTIFIED', 'MONITORING', 'RESOLVED');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('MAINTENANCE', 'INCIDENT');

-- CreateTable
CREATE TABLE "System" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "status" "SystemStatus" NOT NULL DEFAULT 'OPERATIONAL',
    "live" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "System_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "type" "EventType" NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventUpdate" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "description" TEXT,
    "status" "EventStatus" NOT NULL,
    "eventId" UUID NOT NULL,

    CONSTRAINT "EventUpdate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventSystem" (
    "systemId" UUID NOT NULL,
    "eventId" UUID NOT NULL,

    CONSTRAINT "EventSystem_pkey" PRIMARY KEY ("systemId","eventId")
);

-- CreateTable
CREATE TABLE "EmailSubscriber" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "confirmedAt" TIMESTAMP(3),
    "confirmed" BOOLEAN NOT NULL DEFAULT false,
    "email" TEXT NOT NULL,

    CONSTRAINT "EmailSubscriber_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SMSSubscriber" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "confirmedAt" TIMESTAMP(3),
    "confirmed" BOOLEAN NOT NULL DEFAULT false,
    "phoneNumber" TEXT NOT NULL,

    CONSTRAINT "SMSSubscriber_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EventUpdate" ADD CONSTRAINT "EventUpdate_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventSystem" ADD CONSTRAINT "EventSystem_systemId_fkey" FOREIGN KEY ("systemId") REFERENCES "System"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventSystem" ADD CONSTRAINT "EventSystem_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
