import { ComponentStatus } from '@prisma/client'

interface StatusProps {
  status: ComponentStatus
}

export default function Status({ status }: StatusProps) {
  let tagColour
  switch (status) {
    case ComponentStatus.OPERATIONAL:
      tagColour = 'green'
      break
    case ComponentStatus.DEGRADED:
      tagColour = 'yellow'
      break
    case ComponentStatus.MAINTENANCE:
      tagColour = 'blue'
      break
    default:
      tagColour = 'red'
  }
  return <strong className={`govuk-tag govuk-tag--${tagColour}`}>{capitalise(status.replace(/_/g, ' '))}</strong>
}

const capitalise = (s: string) => {
  return s[0].toUpperCase() + s.slice(1).toLowerCase()
}
