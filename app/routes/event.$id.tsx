import { LoaderFunction, LoaderFunctionArgs, json } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import EventTimeline from '../ui/event/timeline'
import Status from '../ui/status'
import prisma from '../.server/db'
import { IncidentWithUpdates } from '../types/dao'

export const loader: LoaderFunction = async ({ params }: LoaderFunctionArgs) => {
  const incident: IncidentWithUpdates = await prisma.incident.findUniqueOrThrow({
    where: {
      id: params.id,
    },
    include: {
      updates: {
        orderBy: {
          createdAt: 'desc',
        }
      }
    }
  })
  const latestStatus = incident.updates ? incident.updates[0].status : 'UNKNOWN'
  return json({incident, latestStatus})
}

export default function Event() {
  const {incident, latestStatus} = useLoaderData<typeof loader>()
  return (
    <div>
      <Link to="/" className="govuk-back-link">
        Back
      </Link>
      <h1 className={'govuk-heading-l'}>{incident.name}</h1>
      <p className={'govuk-body'}>Event ID: {incident.id}</p>

      <table className="govuk-table">
        <thead className="govuk-table__head">
        <tr className="govuk-table__row">
          <th scope="col" className="govuk-table__header govuk-!-width-one-quarter"></th>
          <th scope="col" className="govuk-table__header"></th>
        </tr>
        </thead>
        <tbody className="govuk-table__body">
        <tr className="govuk-table__row">
          <th scope="row" className="govuk-table__header">
            Type
          </th>
          <td className="govuk-table__cell govuk-table__cell--numeric">
            <Status status={incident.type} />
          </td>
        </tr>
        <tr className="govuk-table__row">
          <th scope="row" className="govuk-table__header">
            Status
          </th>
          <td className="govuk-table__cell govuk-table__cell--numeric">
            <Status status={latestStatus} />
          </td>
        </tr>
        </tbody>
      </table>

      <EventTimeline updates={incident.updates} />
    </div>
  )
}
