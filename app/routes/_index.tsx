import {
  type Component,
  ComponentStatus,
  type IncidentComponent,
  IncidentType,
} from '@prisma/client'
import { json, type LoaderFunction } from '@remix-run/node'
import prisma from '../.server/db'
import { Link, useLoaderData } from '@remix-run/react'
import NotificationBanner from '../ui/notificationBanner'
import Status from '../ui/status'
import ActiveEventSummary from '../ui/event/activeEventSummary'
import { type IncidentWithUpdatesAndIncidentComponents, type IndexEvent } from '../types/dao'

export const loader: LoaderFunction = async () => {
  const components: Component[] = await prisma.component.findMany({
    orderBy: {
      name: 'asc',
    },
  })

  const events: IncidentWithUpdatesAndIncidentComponents[] = await prisma.incident.findMany({
    where: {
      active: true,
    },
    include: {
      updates: {
        orderBy: {
          createdAt: 'desc',
        },
        take: 1,
      },
      components: true,
    },
  })

  const indexEvents: IndexEvent[] = events.map(
    (event: IncidentWithUpdatesAndIncidentComponents) => {
      const eventComponents: Component[] = event.components
        ? (event.components.map((ic: IncidentComponent) =>
            components.find((c: Component) => ic.componentId === c.id),
          ) as Component[])
        : ([] as Component[])
      const indexEvent: IndexEvent = {
        event: {
          id: event.id,
          createdAt: event.createdAt,
          name: event.name,
          type: event.type,
          active: event.active,
        },
        components: eventComponents,
        updates: event.updates,
      }
      return indexEvent
    },
  )
  const incidents: IndexEvent[] = Array.from(
    indexEvents.filter((i: IndexEvent) => i.event.type === IncidentType.INCIDENT),
  )
  const maintenance: IndexEvent[] = Array.from(
    indexEvents.filter((i: IndexEvent) => i.event.type === IncidentType.MAINTENANCE),
  )
  const allOperational = components.every(
    (component: Component): boolean => component.status === ComponentStatus.OPERATIONAL,
  )
  return json({
    components,
    indexEvents,
    incidents,
    maintenance,
    allOperational,
  })
}

export default function _index() {
  const {
    components,
    indexEvents,
    incidents,
    maintenance,
    allOperational,
  } = useLoaderData<typeof loader>()
  return (
    <div>
      {allOperational && (
        <NotificationBanner intent={'success'} header={'All systems operational'} messages={['']} />
      )}
      {incidents.length > 0 && (
        <NotificationBanner
          intent={'error'}
          header={'Problems reported'}
          messages={incidents.map((event: IndexEvent) => event.event.name)}
        />
      )}
      {maintenance.length > 0 && (
        <NotificationBanner
          intent={''}
          header={'Maintenance'}
          messages={maintenance.map((event: IndexEvent) => event.event.name)}
        />
      )}
      <table className="govuk-table">
        <caption className="govuk-table__caption govuk-table__caption--l">System overview</caption>
        <tbody className="govuk-table__body">
          {components.map((component: { id: string; name: string; status: ComponentStatus }) => (
            <tr className="govuk-table__row" key={component.id}>
              <th scope="row" className="govuk-table__header">
                {component.name}
              </th>
              <td className="govuk-table__cell govuk-table__cell--numeric">
                <Status status={component.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h1 className={'govuk-heading-l'}>Active events</h1>

      {indexEvents.length < 1 && <p className={`govuk-body`}>No active events</p>}

      {indexEvents.map((event: IndexEvent) => (
        <ActiveEventSummary event={event} key={event.event.id} />
      ))}

      <Link to={'/history'} className={'govuk-link'}>
        Event history &gt;
      </Link>
      <br />
    </div>
  )
}
