import { ActionFunctionArgs, json, type LoaderFunctionArgs } from '@remix-run/node'
import prisma from '../.server/db'
import { Form, Link, useActionData, useLoaderData } from '@remix-run/react'
import { type Component, ComponentStatus } from '@prisma/client'
import friendlyStatus from '../helper/friendlyStatus'
import { updateComponent } from '../.server/queries'

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const component: Component = await prisma.component.findUniqueOrThrow({
    where: {
      id: params.id,
    },
  })
  return json(component)
}

export default function EditSystem() {
  const component = useLoaderData<typeof loader>()
  const data = useActionData<typeof action>()
  return (
    <div>
      <Link to="/manager/systems" className="govuk-back-link">
        Back
      </Link>
      <h1 className="govuk-heading-l">Edit System</h1>
      <p className="govuk-body">System ID: {component.id}</p>
      <Form method="post">
        <input hidden={true} readOnly={true} value={component.id} name="systemId" />
        <fieldset className="govuk-fieldset">
          <div className="govuk-form-group">
            <label className="govuk-label" htmlFor="system-name">
              System name
            </label>
            <input className="govuk-input govuk-!-width-two-thirds" id="system-name" name="systemName" type="text" defaultValue={component.name} />
          </div>
          <div className="govuk-form-group">
            <label className="govuk-label" htmlFor="system-description">
              System description
            </label>
            <input className="govuk-input govuk-!-width-two-thirds" id="system-description" name="systemDescription" type="text" defaultValue={component.description || ''} />
          </div>
          <div className="govuk-form-group">
            <label className="govuk-label" htmlFor="system-status">
              System Status
            </label>
            <select className="govuk-select" id="system-status" name="systemStatus" defaultValue={component.status}>
              {Object.values(ComponentStatus).map((status) => (
                <option key={status} value={status}>
                  {friendlyStatus(status)}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="govuk-button" data-module="govuk-button">
            Update
          </button>
        </fieldset>

        {data ? data.message : 'Waiting...'}
      </Form>
    </div>
  )
}

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.formData()
  const status = body.get('systemStatus') as ComponentStatus
  const name = body.get('systemName') as string
  const description = body.get('systemDescription') as string
  const id = body.get('systemId') as string
  const result = await updateComponent(id, name, description, status)
  if (result !== null && result !== undefined) {
    return json({ message: `system id: ${result.id} updated` })
  } else {
    return json({ message: `problem updating component` })
  }
}
