import { Event, EventStatus, EventSystem, EventUpdate, System } from '@prisma/client'

export interface EventUpdateDao {
  description: string
  status: EventStatus
}

export interface EventWithUpdates extends Event {
  updates?: EventUpdate[]
}

export interface EventWithUpdatesAndEventSystems extends Event {
  updates?: EventUpdate[]
  systems?: EventSystem[]
}

export interface IndexEvent {
  event: Event
  systems?: System[]
  updates?: EventUpdate[]
}
