import { ActionFunctionArgs, json, type LoaderFunction } from '@remix-run/node'
import { Form, Link, useActionData, useLoaderData } from '@remix-run/react'
import { type Component, Incident, IncidentType } from '@prisma/client'
import { createIncidentAndLinkToExistingComponents } from '../.server/queries'
import prisma from '../.server/db'


export const loader: LoaderFunction = async () => {
  const components: Component[] = await prisma.component.findMany()
  return json(components)
}


export default function NewEvent() {
  const components = useLoaderData<typeof loader>()
  const data = useActionData<typeof action>()
  return (
    <div>
      <Link to="/manager" className="govuk-back-link">
        Back
      </Link>
      <Form method="post">
        <fieldset className="govuk-fieldset">
          <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
            <h1 className="govuk-fieldset__heading">New Event</h1>
          </legend>
          <div className="govuk-form-group">
            <label className="govuk-label" htmlFor="components">
              Affected System
            </label>
            <select style={{height:"150px"}} className="govuk-select" id="components" name="components" multiple>
              {components.map((c: Component) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="govuk-form-group">
            <label className="govuk-label" htmlFor="event-name">
              Event name
            </label>
            <input className="govuk-input govuk-!-width-two-thirds" id="event-name" name="eventName" type="text" autoComplete="event-name" />
          </div>
          <div className="govuk-form-group">
            <label className="govuk-label" htmlFor="event-type">
              Event type
            </label>
            <select className="govuk-select" id="event-type" name="eventType">
              {Object.values(IncidentType).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="govuk-button" data-module="govuk-button">
            Save and continue
          </button>
        </fieldset>

        {data ? data.message : 'Waiting...'}
      </Form>
    </div>
  )
}

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.formData()
  const type = body.get('eventType') as IncidentType
  const name = body.get('eventName') as string
  const components = body.getAll('components') as string[]
  const result = await createIncidentAndLinkToExistingComponents(components, name, type)
  if (result !== null && result !== undefined) {
    return json({ message: `event id: ${result.id} created` })
  } else {
    return json({ message: `problem persisting event` })
  }

}
