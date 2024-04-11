import Status from '../status'
import { Link } from '@remix-run/react'
import { IndexEvent } from 'app/types/dao'
import { EventType, System } from '@prisma/client'

interface ActiveEventSummaryProps {
  event: IndexEvent
}

export default function ActiveEventSummary({ event }: Readonly<ActiveEventSummaryProps>) {
  const lastUpdated = new Date(
    event.updates ? event.updates[0].createdAt : event.event.createdAt,
  )
  const formattedDate = `${lastUpdated.toLocaleDateString()} ${lastUpdated.toLocaleTimeString()}`
  const status = event.updates ? event.updates[0].status : 'UNKNOWN'
  const insetColour = event.event.type === EventType.INCIDENT ? 'red' : 'blue'
  return (
    <div className={`govuk-inset-text govuk-inset-text--${insetColour}`}>
      <Status status={event.event.type} />
      &nbsp;
      <Status status={status} />
      <h3>{event.event.name}</h3>
      <p>Systems affected:</p>
      <ul className={'govuk-list'}>
        {event.systems?.map((s: System) => <li key={s.id}>{s.name}</li>)}
      </ul>
      <p>
        Last update: <time dateTime={formattedDate}><strong>{formattedDate}</strong></time>
      </p>
      <Link to={`/event/${event.event.id}`} className={'govuk-link'}>
        See timeline
      </Link>
    </div>
  )
}
