import { type ActionFunctionArgs, json, type LoaderFunction, redirect } from '@remix-run/node'
import { Form, Link, useActionData, useLoaderData } from '@remix-run/react'
import { createEventAndLinkToExistingSystems } from '../.server/queries'
import prisma from '../.server/db'
import { type EventUpdateDao } from '../types/events'
import { EventStatus, EventType, type System } from '@prisma/client'

export const handle = {
  Breadcrumb: () => <Link className={'govuk-breadcrumbs__link'} to="/manager/events/new">New event</Link>,
}

export const loader: LoaderFunction = async () => {
  const systems: System[] = await prisma.system.findMany()
  return json(systems)
}

export default function NewEvent() {
  const systems = useLoaderData<typeof loader>()
  const data = useActionData<typeof action>()
  return (
    <div>
      <h2 className="govuk-heading-m">New Event</h2>
      <Form method="post">
        <fieldset className="govuk-fieldset">
          <div className="govuk-form-group">
            <label className="govuk-label" htmlFor="systems">
              Link Systems
            </label>
            <select
              style={{ height: '150px' }}
              className="govuk-select"
              id="systems"
              name="systems"
              multiple
            >
              {systems.map((s: System) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div className="govuk-form-group">
            <label className="govuk-label" htmlFor="event-name">
              Event name
            </label>
            <input
              className="govuk-input govuk-!-width-two-thirds"
              id="event-name"
              name="eventName"
              type="text"
            />
          </div>
          <div className="govuk-form-group">
            <label className="govuk-label" htmlFor="event-type">
              Event type
            </label>
            <select className="govuk-select" id="event-type" name="eventType">
              {Object.values(EventType).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="govuk-button" data-module="govuk-button">
            Add event
          </button>
        </fieldset>

        {data ? data.message : 'Waiting...'}
      </Form>
    </div>
  )
}

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.formData()
  const type = body.get('eventType') as EventType
  const name = body.get('eventName') as string
  const systems = body.getAll('systems') as string[]
  const defaultUpdate: EventUpdateDao = {
    status: type === EventType.INCIDENT ? EventStatus.INVESTIGATING : EventStatus.SCHEDULED,
    description:
      type === EventType.INCIDENT
        ? 'We are currently investigating this issue.'
        : 'Maintenance is scheduled.',
  }
  const result = await createEventAndLinkToExistingSystems(systems, name, type, defaultUpdate)
  if (result !== null && result !== undefined) {
    return redirect('/manager/events')
  } else {
    return json({ message: `problem persisting event` })
  }
}
