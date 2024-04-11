import { Form, Link, useActionData } from '@remix-run/react'
import friendlyStatus from '../helper/friendlyStatus'
import { type ActionFunctionArgs, json, redirect } from '@remix-run/node'
import { createSystem } from '../.server/queries'
import { SystemStatus } from '@prisma/client'

export const handle = {
  Breadcrumb: () => <Link className={'govuk-breadcrumbs__link'} to="/manager/systems/new">New system</Link>,
}

export default function NewSystem() {
  const data = useActionData<typeof action>()
  return (
    <div>
      <h1 className="govuk-heading-l">New System</h1>
      <Form method="post">
        <fieldset className="govuk-fieldset">
          <div className="govuk-form-group">
            <label className="govuk-label" htmlFor="system-name">
              System name
            </label>
            <input className="govuk-input govuk-!-width-two-thirds" id="system-name" name="systemName" type="text" />
          </div>
          <div className="govuk-form-group">
            <label className="govuk-label" htmlFor="system-description">
              System description
            </label>
            <input className="govuk-input govuk-!-width-two-thirds" id="system-description" name="systemDescription" type="text" />
          </div>
          <div className="govuk-form-group">
            <label className="govuk-label" htmlFor="system-status">
              System Status
            </label>
            <select className="govuk-select" id="system-status" name="systemStatus">
              {Object.values(SystemStatus).map((status) => (
                <option key={status} value={status}>
                  {friendlyStatus(status)}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="govuk-button" data-module="govuk-button">
            Add system
          </button>
        </fieldset>

        {data ? data.message : 'Waiting...'}
      </Form>
    </div>
  )
}

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.formData()
  const status = body.get('systemStatus') as SystemStatus
  const name = body.get('systemName') as string
  const description = body.get('systemDescription') as string
  const result = await createSystem(name, description, status)
  if (result !== null && result !== undefined) {
    return redirect('/manager/systems')
  } else {
    return json({ message: `problem creating system` })
  }
}
