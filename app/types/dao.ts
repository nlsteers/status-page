import { Component, Incident, IncidentComponent, IncidentStatus, IncidentUpdate } from '@prisma/client'

export interface IncidentUpdateDao {
  description: string
  status: IncidentStatus
}

export interface IncidentWithUpdates extends Incident{
  updates?: IncidentUpdate[]
}

export interface IncidentWithUpdatesAndIncidentComponents extends Incident{
  updates?: IncidentUpdate[]
  components?: IncidentComponent[]
}

export interface IndexEvent{
  event: Incident
  components?: Component[]
  updates?: IncidentUpdate[]
}

export enum MaintenanceStatus {
  SCHEDULED,
  IN_PROGRESS,
  COMPLETED
}



