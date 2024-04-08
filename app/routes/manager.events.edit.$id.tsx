import {
  ActionFunctionArgs,
  json,
  LoaderFunction,
  LoaderFunctionArgs,
  redirect,
} from '@remix-run/node'
import { Incident, IncidentType } from '@prisma/client'
import prisma from '../.server/db'
import { Form, Link, useActionData, useLoaderData } from '@remix-run/react'
import friendlyStatus from '../helper/friendlyStatus'
import { deleteIncident, updateIncident } from '../.server/queries'

export const loader: LoaderFunction = async ({ params }: LoaderFunctionArgs) => {
  const incident: Incident = await prisma.incident.findUniqueOrThrow({
    where: {
      id: params.id,
    },
  })
  return json(incident)
}
export default function EditEvent() {
  const event = useLoaderData<typeof loader>()
  const data = useActionData<typeof action>()
  return (
    <div>
      <Link to="/manager/events" className="govuk-back-link">
        Back
      </Link>
      <p className={`govuk-body`}>edit event {event.id}</p>
      <Form method="post">
        <fieldset className="govuk-fieldset">
          <input hidden={true} readOnly={true} value={event.id} name="eventId" />
          <div className="govuk-form-group">
            <label className="govuk-label" htmlFor="event-name">
              Event Name
            </label>
            <input
              className="govuk-input govuk-!-width-two-thirds"
              id="event-name"
              name="eventName"
              defaultValue={event.name}
            ></input>
          </div>
          <div className="govuk-form-group">
            <label className="govuk-label" htmlFor="event-type">
              Event type
            </label>
            <select
              className="govuk-select"
              id="event-type"
              name="eventType"
              defaultValue={event.type}
            >
              {Object.values(IncidentType).map((status) => (
                <option key={status} value={status}>
                  {friendlyStatus(status)}
                </option>
              ))}
            </select>
          </div>
          <div className="govuk-form-group">
            <div className="govuk-checkboxes" data-module="govuk-checkboxes">
              <div className="govuk-checkboxes__item">
                <input
                  className="govuk-checkboxes__input"
                  id="active-event"
                  name="activeEvent"
                  type="checkbox"
                  defaultChecked={event.active}
                />
                <label className="govuk-label govuk-checkboxes__label" htmlFor="active-event">
                  Active event?
                </label>
              </div>
            </div>
          </div>
          <button type="submit" className="govuk-button" data-module="govuk-button">
            Edit event
          </button>
        </fieldset>
      </Form>
      <Form method="delete">
        <fieldset className="govuk-fieldset">
          <input hidden={true} readOnly={true} value={event.id} name="eventId" />
          <button
            type="submit"
            className="govuk-button govuk-button--warning"
            data-module="govuk-button"
          >
            Delete event
          </button>
        </fieldset>
      </Form>
      {data ? data.message : 'Waiting...'}
    </div>
  )
}

export async function action({ request }: ActionFunctionArgs) {
  switch (request.method) {
    case 'POST': {
      const body = await request.formData()
      const eventName = body.get('eventName') as string
      const eventType = body.get('eventType') as IncidentType
      const eventId = body.get('eventId') as string
      const active = body.get('activeEvent') as string
      const result = await updateIncident(eventId, eventName, eventType, active === 'on')
      if (result !== null && result !== undefined) {
        return json({ message: `event id: ${result.id} updated` })
      } else {
        return json({ message: `problem updating event` })
      }
    }
    case 'DELETE': {
      const body = await request.formData()
      const eventId = body.get('eventId') as string
      const result = await deleteIncident(eventId)
      if (result !== null && result !== undefined) {
        return redirect('/manager/events')
      } else {
        return json({ message: `problem updating event` })
      }
    }
  }
}
