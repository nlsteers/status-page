import {
  type ActionFunctionArgs,
  json,
  type LoaderFunction,
  type LoaderFunctionArgs,
  redirect,
} from '@remix-run/node'
import prisma from '../.server/db'
import { Form, Link, useActionData, useLoaderData, useParams } from '@remix-run/react'
import friendlyStatus from '../helper/friendlyStatus'
import { deleteEvent, updateEventAndRelinkComponents } from '../.server/queries'
import { type Event, type EventSystem, EventType, type System } from '@prisma/client'
import truncate from '../helper/truncateString'

export const handle = {
  Breadcrumb: () => {
    const params = useParams()
    return <Link className={'govuk-breadcrumbs__link'} to={`/manager/events/edit/${params.id}`}>Edit event {truncate(params.id as string)}</Link>
  },
}

export const loader: LoaderFunction = async ({ params }: LoaderFunctionArgs) => {
  const systems: System[] = await prisma.system.findMany()
  const event: Event = await prisma.event.findUniqueOrThrow({
    where: {
      id: params.id,
    },
    include: {
      systems: true,
    },
  })
  return json({ systems, event })
}

export default function EditEvent() {
  const { systems, event } = useLoaderData<typeof loader>()
  const currentSystems: string[] = event.systems.map(
    (eventSystem: EventSystem) => eventSystem.systemId,
  )
  const data = useActionData<typeof action>()
  return (
    <div>
      <h2 className="govuk-heading-m">Edit Event</h2>
      <p className={'govuk-body'}>Event ID: {event.id}</p>
      <Form method="post">
        <fieldset className="govuk-fieldset">
          <input hidden={true} readOnly={true} value={event.id} name="eventId" key={event.id} />
          <div className="govuk-form-group">
            <label className="govuk-label" htmlFor="event-name">
              Event Name
            </label>
            <input
              className="govuk-input govuk-!-width-two-thirds"
              id="event-name"
              name="eventName"
              defaultValue={event.name}
              key={event.id}
            ></input>
          </div>
          <div className="govuk-form-group">
            <label className="govuk-label" htmlFor="systems">
              Affected Systems
            </label>
            <select
              style={{ height: '150px' }}
              className="govuk-select"
              id="systems"
              name="systems"
              defaultValue={currentSystems}
              key={event.id}
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
            <label className="govuk-label" htmlFor="event-type">
              Event type
            </label>
            <select
              className="govuk-select"
              id="event-type"
              name="eventType"
              defaultValue={event.type}
              key={event.id}
            >
              {Object.values(EventType).map((status) => (
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
                  key={event.id}
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
          <input hidden={true} readOnly={true} value={event.id} name="eventId" key={event.id}  />
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
      const eventType = body.get('eventType') as EventType
      const eventId = body.get('eventId') as string
      const active = body.get('activeEvent') as string
      const systems = body.getAll('systems') as string[]
      const result = await updateEventAndRelinkComponents(
        eventId,
        eventName,
        eventType,
        active === 'on',
        systems,
      )
      if (result !== null && result !== undefined) {
        return redirect('/manager/events')
      } else {
        return json({ message: `problem updating event` })
      }
    }
    case 'DELETE': {
      const body = await request.formData()
      const eventId = body.get('eventId') as string
      const result = await deleteEvent(eventId)
      if (result !== null && result !== undefined) {
        return redirect('/manager/events')
      } else {
        return json({ message: `problem updating event` })
      }
    }
  }
}
