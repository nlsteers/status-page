import { type LoaderFunction, type LoaderFunctionArgs, json } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import EventTimeline from '../ui/event/timeline'
import Status from '../ui/status'
import prisma from '../.server/db'
import { type EventWithUpdates } from '../types/events'

export const loader: LoaderFunction = async ({ params }: LoaderFunctionArgs) => {
  const event: EventWithUpdates = await prisma.event.findUniqueOrThrow({
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
  const latestStatus = event.updates ? event.updates[0].status : 'UNKNOWN'
  return json({event, latestStatus})
}

export default function Event() {
  const {event, latestStatus} = useLoaderData<typeof loader>()
  return (
    <div>
      <Link to="/" className="govuk-back-link">
        Back
      </Link>
      <h1 className={'govuk-heading-l'}>{event.name}</h1>
      <p className={'govuk-body'}>Event ID: {event.id}</p>

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
            <Status status={event.type} />
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

      <EventTimeline updates={event.updates} />
    </div>
  )
}
