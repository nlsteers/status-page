import friendlyStatus from '../helper/friendlyStatus'
import { EventStatus, EventType, SystemStatus } from '@prisma/client'

interface StatusProps {
  status: SystemStatus | EventStatus | EventType | string
}

export default function Status({ status }: StatusProps) {
  let tagColour
  switch (status) {
    case SystemStatus.OPERATIONAL:
    case EventStatus.COMPLETED:
    case EventStatus.RESOLVED:
    case 'ACTIVE':
      tagColour = 'green'
      break
    case SystemStatus.DEGRADED:
      tagColour = 'yellow'
      break
    case SystemStatus.MAINTENANCE:
    case EventStatus.MONITORING:
    case EventType.MAINTENANCE:
      tagColour = 'blue'
      break
    case EventStatus.INVESTIGATING:
      tagColour = 'orange'
      break
    case EventStatus.IDENTIFIED: case EventStatus.IN_PROGRESS:
      tagColour = 'light-blue'
      break
    case SystemStatus.MAJOR_OUTAGE:
    case SystemStatus.PARTIAL_OUTAGE:
    case EventType.INCIDENT:
      tagColour = 'red'
      break
    default:
      tagColour = 'grey'
  }
  return <strong className={`govuk-tag govuk-tag--${tagColour}`}>{friendlyStatus(status)}</strong>
}
