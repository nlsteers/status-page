import prisma from './db'
import { Component, Incident, IncidentType, IncidentUpdate } from '@prisma/client'

async function createIncidentAndLinkToExistingComponents(componentIds: string[], name: string, type: IncidentType) {
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
        // Optionally, add any initial updates for the incident
        // updates: {
        //   create: [
        //     { content: 'Initial report of network outage.' },
        //     { content: 'Technicians have been dispatched.' },
        //   ],
        // },
      },
    });

    console.log('Incident created and linked to existing components:', newIncident);
    return newIncident;
  } catch (error) {
    console.error('Error creating incident:', error);
  }
}

async function createIncidentUpdate(incidentUpdate: IncidentUpdate, incidentId: string) {
  try {
    const newIncidentUpdate = await prisma.incidentUpdate.create({
      data: {
        status: incidentUpdate.status,
        description: incidentUpdate.description,
        incidentId: incidentId
      },
    });

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

export {
  createIncidentAndLinkToExistingComponents,
  createComponent,
  createIncidentUpdate
}
