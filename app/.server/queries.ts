import prisma from './db'
import { EventType, SystemStatus } from '@prisma/client'
import { type EventUpdateDao } from '../types/events'

async function createEventAndLinkToExistingSystems(
  systemIds: string[],
  name: string,
  type: EventType,
  defaultUpdate: EventUpdateDao,
) {
  try {
    const newEvent = await prisma.event.create({
      data: {
        name,
        type,

        systems: {
          create: systemIds.map((id) => ({
            system: {
              connect: {
                id
              },
            },
          })),
        },
        updates: {
          create: [
            {
              description: defaultUpdate.description,
              status: defaultUpdate.status,
            },
          ],
        },
      },
    })
    console.log('Event created and linked to existing systems:', newEvent)
    return newEvent
  } catch (error) {
    console.error('Error creating event:', error)
  }
}

async function createEventUpdate(eventUpdate: EventUpdateDao, eventId: string) {
  try {
    const newEventUpdate = await prisma.eventUpdate.create({
      data: {
        status: eventUpdate.status,
        description: eventUpdate.description,
        eventId
      },
    })
    console.log('Event update created:', newEventUpdate)
    return newEventUpdate
  } catch (error) {
    console.error('Error creating event update:', error)
  }
}


async function createSystem(name: string, description: string, status: SystemStatus) {
  try {
    const newSystem = await prisma.system.create({
      data: {
        name,
        description,
        status
      },
    })

    console.log('System created:', newSystem)
    return newSystem
  } catch (error) {
    console.error('Error creating system:', error)
  }
}

async function updateSystem(
  id: string,
  name: string,
  description: string,
  status: SystemStatus,
) {
  const now = new Date()
  try {
    const updatedSystem = await prisma.system.update({
      where: {
        id,
      },
      data: {
        name,
        description,
        status,
        updatedAt: now,
      },
    })

    console.log('System updated:', updatedSystem)
    return updatedSystem
  } catch (error) {
    console.error('Error updating system:', error)
  }
}

async function updateEvent(id: string, name: string, type: EventType, active: boolean) {
  try {
    const updatedEvent = await prisma.event.update({
      where: {
        id,
      },
      data: {
        name,
        type,
        active,
      },
    })
    console.log('Event updated:', updatedEvent)
    return updatedEvent
  } catch (error) {
    console.error('Error updating event:', error)
  }
}

async function updateEventAndRelinkComponents(
  id: string,
  name: string,
  type: EventType,
  active: boolean,
  newSystems: string[],
) {
  try {
    const deleteEventSystems = await prisma.eventSystem.deleteMany({
      where: {
        eventId: id
      }
    })
    console.log('Systems unlinked:', deleteEventSystems.count)
    const updatedEvent = await prisma.event.update({
      where: {
        id,
      },
      data: {
        name,
        type,
        active,

        systems: {
          create: newSystems.map((id) => ({
            system: {
              connect: {
                id
              },
            },
          })),
        },
      },
    })
    console.log('Event updated:', updatedEvent)
    return updatedEvent
  } catch (error) {
    console.error('Error updating event:', error)
  }
}

async function deleteEvent(id: string) {
  try {
    const result = await prisma.event.delete({
      where: {
        id,
      },
      include: {
        updates: true,
      },
    })
    console.log('Event deleted:', result.id)
    return result
  } catch (error) {
    console.error('Error deleting event:', error)
  }
}

export {
  createEventAndLinkToExistingSystems,
  createSystem,
  updateSystem,
  updateEvent,
  updateEventAndRelinkComponents,
  deleteEvent,
  createEventUpdate,
}
