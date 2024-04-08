import { ActionFunctionArgs, json, LoaderFunction, LoaderFunctionArgs } from '@remix-run/node'
import { Incident, IncidentStatus, IncidentUpdate } from '@prisma/client'
import prisma from '../.server/db'
import { Form, Link, useLoaderData } from '@remix-run/react'
import friendlyStatus from '../helper/friendlyStatus'
import Status from '../ui/status'
import { createIncidentUpdate } from '../.server/queries'

export const loader: LoaderFunction = async ({ params }: LoaderFunctionArgs) => {
  const incidentUpdates: IncidentUpdate[] = await prisma.incidentUpdate.findMany({
    where: {
      incidentId: params.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 1,
  })
  const incident: Incident = await prisma.incident.findUniqueOrThrow({
    where: {
      id: params.id,
    }
  })
  return json({ incidentUpdates, incidentId: params.id })
}

export default function UpdateEvent() {
  const { incidentUpdates, incidentId } = useLoaderData<typeof loader>()
  return (
    <div>
      <Link to="/manager" className="govuk-back-link">
        Back
      </Link>

      <h1 className={'govuk-heading-l'}>Update event</h1>
      <p className={'govuk-body'}>Event: {incidentId}</p>
      {incidentUpdates.length > 0 ? (
        <table className="govuk-table">
          <caption className="govuk-table__caption govuk-table__caption--m">Current event status</caption>
          <tbody className="govuk-table__body">
            {incidentUpdates.map((incidentUpdate: { id: string; status: IncidentStatus }) => (
              <tr className="govuk-table__row" key={incidentUpdate.id}>
                <td className="govuk-table__cell">{incidentUpdate.id}</td>
                <td className="govuk-table__cell govuk-table__cell--numeric">
                  <Status status={incidentUpdate.status} />
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
          <input hidden={true} readOnly={true} value={incidentId} name="incidentId" />
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
              {Object.values(IncidentStatus).map((status) => (
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

      </Form>
    </div>
  )
}

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.formData()
  const status = body.get('eventUpdateStatus') as IncidentStatus
  const description = body.get('eventUpdateDescription') as string
  const incidentId = body.get('incidentId') as string
  const result = await createIncidentUpdate({ status, description }, incidentId)
  if (result !== null && result !== undefined) {
    return json({ message: `event id: ${result.id} updated` })
  } else {
    return json({ message: `problem updating event` })
  }
}
