import { type EventSystem, EventType, type System, SystemStatus } from '@prisma/client'
import { json, type LoaderFunction } from '@remix-run/node'
import prisma from '../.server/db'
import { Link, useLoaderData } from '@remix-run/react'
import NotificationBanner from '../ui/notificationBanner'
import Status from '../ui/status'
import ActiveEventSummary from '../ui/event/activeEventSummary'
import { type EventWithUpdatesAndEventSystems, type IndexEvent } from '../types/events'

export const loader: LoaderFunction = async () => {
  const systems: System[] = await prisma.system.findMany({
    orderBy: {
      name: 'asc',
    },
  })

  const events: EventWithUpdatesAndEventSystems[] = await prisma.event.findMany({
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
      systems: true,
    },
  })

  const indexEvents: IndexEvent[] = events.map((event: EventWithUpdatesAndEventSystems) => {
    const eventSystems: System[] = event.systems
      ? (event.systems.map((es: EventSystem) =>
          systems.find((s: System) => es.systemId === s.id),
        ) as System[])
      : ([] as System[])
    const indexEvent: IndexEvent = {
      event: event,
      systems: eventSystems,
      updates: event.updates,
    }
    return indexEvent
  })
  const incidents: IndexEvent[] = Array.from(
    indexEvents.filter((i: IndexEvent) => i.event.type === EventType.INCIDENT),
  )
  const maintenance: IndexEvent[] = Array.from(
    indexEvents.filter((i: IndexEvent) => i.event.type === EventType.MAINTENANCE),
  )
  const allOperational = systems.every(
    (system: System): boolean => system.status === SystemStatus.OPERATIONAL,
  )
  return json({
    systems,
    indexEvents,
    incidents,
    maintenance,
    allOperational,
  })
}

export default function _index() {
  const { systems, indexEvents, incidents, maintenance, allOperational } =
    useLoaderData<typeof loader>()
  return (
    <div className="govuk-grid-row">
      <div className={`govuk-grid-column-full`}>
        {allOperational && (
          <NotificationBanner
            intent={'success'}
            header={'All systems operational'}
            messages={['']}
          />
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
          <caption className="govuk-table__caption govuk-table__caption--l">
            System overview
          </caption>
          <tbody className="govuk-table__body">
            {systems.map((system: { id: string; name: string; status: SystemStatus }) => (
              <tr className="govuk-table__row" key={system.id}>
                <th scope="row" className="govuk-table__header">
                  {system.name}
                </th>
                <td className="govuk-table__cell govuk-table__cell--numeric">
                  <Status status={system.status} />
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
    </div>
  )
}
