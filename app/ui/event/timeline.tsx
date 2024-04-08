import Status from '../status'
import { IncidentUpdate } from '@prisma/client'

interface EventTimelineProps {
  updates: IncidentUpdate[]
}

export default function EventTimeline({updates}: EventTimelineProps) {
  return (
    <div className="govuk-incident-timeline">
      {updates.map((update: IncidentUpdate) => (
        <div className="govuk-incident-timeline__item" key={update.id}>
          <div className="govuk-incident-timeline__item__header">
            <Status status={update.status} />
          </div>
          <p className="govuk-incident-timeline__item__date">
            <time dateTime={new Date(update.createdAt).toLocaleDateString()}>{new Date(update.createdAt).toLocaleDateString()} {new Date(update.createdAt).toLocaleTimeString()}</time>
          </p>
          <div className="govuk-incident-timeline__item__description">
            <p className={'govuk-body'} style={{whiteSpace: "pre-line"}}>
              {update.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
