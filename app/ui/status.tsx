import { IncidentStatus, ComponentStatus, IncidentType } from '@prisma/client'
import friendlyStatus from '../helper/friendlyStatus'

interface StatusProps {
  status: ComponentStatus | IncidentStatus | IncidentType | string
}

export default function Status({ status }: StatusProps) {
  let tagColour
  switch (status) {
    case ComponentStatus.OPERATIONAL:
    case IncidentStatus.COMPLETED:
    case IncidentStatus.RESOLVED:
    case 'ACTIVE':
      tagColour = 'green'
      break
    case ComponentStatus.DEGRADED:
      tagColour = 'yellow'
      break
    case ComponentStatus.MAINTENANCE:
    case IncidentStatus.MONITORING:
    case IncidentType.MAINTENANCE:
      tagColour = 'blue'
      break
    case IncidentStatus.INVESTIGATING:
      tagColour = 'orange'
      break
    case IncidentStatus.IDENTIFIED:
      tagColour = 'light-blue'
      break
    case ComponentStatus.MAJOR_OUTAGE:
    case ComponentStatus.PARTIAL_OUTAGE:
    case IncidentType.INCIDENT:
      tagColour = 'red'
      break
    default:
      tagColour = 'grey'
  }
  return <strong className={`govuk-tag govuk-tag--${tagColour}`}>{friendlyStatus(status)}</strong>
}
