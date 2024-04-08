import prisma from './db'
import { Component, ComponentStatus, IncidentType } from '@prisma/client'
import { type IncidentUpdateDao } from '../types/dao'

async function createIncidentAndLinkToExistingComponents(componentIds: string[], name: string, type: IncidentType, defaultUpdate: IncidentUpdateDao) {
  try {
    const newIncident = await prisma.incident.create({
      data: {
        name,
        type,

        components: {
          create: componentIds.map((componentId) => ({
            component: {
              connect: {
                id: componentId,
              },
            },
          })),
        },
        updates: {
          create: [
            {
              description: defaultUpdate.description,
              status: defaultUpdate.status
            }
          ],
        },
      },
    });
    console.log('Incident created and linked to existing components:', newIncident);
    return newIncident;
  } catch (error) {
    console.error('Error creating incident:', error);
  }
}

async function createIncidentUpdate(incidentUpdate: IncidentUpdateDao, incidentId: string) {
  try {
    const newIncidentUpdate = await prisma.incidentUpdate.create({
      data: {
        status: incidentUpdate.status,
        description: incidentUpdate.description,
        incidentId: incidentId
      },
    })
    console.log('Incident update created:', newIncidentUpdate);
    return newIncidentUpdate;
  } catch (error) {
    console.error('Error creating incident update:', error);
  }
}


async function createComponent(component: Component) {
  try {
    const newComponent = await prisma.component.create({
      data: {
        name: component.name,
        description: component.description
      },
    });

    console.log('Component created:', newComponent);
    return newComponent;
  } catch (error) {
    console.error('Error creating component:', error);
  }
}

async function updateComponent(id: string, name: string, description: string, status: ComponentStatus) {
  const now = new Date();
  try {
    const updatedComponent = await prisma.component.update({
      where: {
        id
      },
      data: {
        name,
        description,
        status,
        updatedAt: now
      },
    });

    console.log('Component updated:', updatedComponent);
    return updatedComponent;
  } catch (error) {
    console.error('Error updating component:', error);
  }
}

async function updateIncident(id: string, name: string, type: IncidentType, active: boolean) {
  try {
    const updatedComponent = await prisma.incident.update({
      where: {
        id
      },
      data: {
        name,
        type,
        active
      },
    });
    console.log('Incident updated:', updatedComponent);
    return updatedComponent;
  } catch (error) {
    console.error('Error updating incident:', error);
  }
}

async function deleteIncident(id: string) {
  try {
    const result = await prisma.incident.delete({
      where: {
        id
      },
      include: {
        updates: true
      }
    });
    console.log('Incident deleted:', result.id);
    return result;
  } catch (error) {
    console.error('Error deleting incident:', error);
  }
}


export {
  createIncidentAndLinkToExistingComponents,
  createComponent,
  updateComponent,
  updateIncident,
  deleteIncident,
  createIncidentUpdate
}
