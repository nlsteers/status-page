import { type ActionFunctionArgs, json, type LoaderFunction, type LoaderFunctionArgs, redirect } from '@remix-run/node'
import prisma from '../.server/db'
import { Form, Link, useActionData, useLoaderData, useParams } from '@remix-run/react'
import friendlyStatus from '../helper/friendlyStatus'
import Status from '../ui/status'
import { createEventUpdate } from '../.server/queries'
import { EventStatus} from '@prisma/client'
import { type EventWithUpdates } from '../types/events'
import truncate from '../helper/truncateString'

export const handle = {
  Breadcrumb: () => {
    const params = useParams()
    return <Link className={'govuk-breadcrumbs__link'} to={`/manager/events/update/${params.id}`}>Update event {truncate(params.id as string)}</Link>
  },
}

export const loader: LoaderFunction = async ({ params }: LoaderFunctionArgs) => {
  const event: EventWithUpdates = await prisma.event.findUniqueOrThrow({
    where: {
      id: params.id
    },
    include: {
      updates: {
        orderBy: {
          createdAt: 'desc'
        },
        take: 1
      }
    }
  })
  return json({ event })
}

export default function UpdateEvent() {
  const { event } = useLoaderData<typeof loader>()
  const data = useActionData<typeof action>()
  return (
    <div>
      <h2 className="govuk-heading-m">Update Event</h2>
      <p className={'govuk-body'}>Event ID: {event.id}</p>
      {event.updates.length > 0 ? (
        <table className="govuk-table">
          <tbody className="govuk-table__body">
            {event.updates.map((eventUpdate: { id: string; status: EventStatus }) => (
              <tr className="govuk-table__row" key={eventUpdate.id}>
                <td className="govuk-table__cell">Current event status</td>
                <td className="govuk-table__cell govuk-table__cell--numeric">
                  <Status status={eventUpdate.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className={'govuk-body'}>No existing updates, add one...</p>
      )}
      <Form method="post">
        <fieldset className="govuk-fieldset">
          <input hidden={true} readOnly={true} value={event.id} name="eventId" />
          <div className="govuk-form-group">
            <label className="govuk-label" htmlFor="event-update-description">
              Event Update
            </label>
            <textarea rows={5} className="govuk-textarea govuk-!-width-two-thirds" id="event-update-description" name="eventUpdateDescription"></textarea>
          </div>
          <div className="govuk-form-group">
            <label className="govuk-label" htmlFor="event-update-status">
              Event update status
            </label>
            <select className="govuk-select" id="event-update-status" name="eventUpdateStatus">
              {Object.values(EventStatus).map((status) => (
                <option key={status} value={status}>
                  {friendlyStatus(status)}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="govuk-button" data-module="govuk-button">
            Add event update
          </button>
        </fieldset>
        {data ? data.message : 'Waiting...'}
      </Form>
    </div>
  )
}

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.formData()
  const status = body.get('eventUpdateStatus') as EventStatus
  const description = body.get('eventUpdateDescription') as string
  const eventId = body.get('eventId') as string
  const result = await createEventUpdate({ status, description }, eventId)
  if (result !== null && result !== undefined) {
    return redirect(`/manager/events`)
  } else {
    return json({ message: `problem updating event` })
  }
}
