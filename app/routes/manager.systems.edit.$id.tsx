import { type ActionFunctionArgs, json, type LoaderFunctionArgs, redirect } from '@remix-run/node'
import prisma from '../.server/db'
import { Form, Link, useActionData, useLoaderData, useParams } from '@remix-run/react'
import friendlyStatus from '../helper/friendlyStatus'
import { updateSystem } from '../.server/queries'
import { type System, SystemStatus } from '@prisma/client'
import truncate from '../helper/truncateString'

export const handle = {
  Breadcrumb: () => {
    const params = useParams()
    return (
      <Link className={'govuk-breadcrumbs__link'} to={`/manager/systems/edit/${params.id}`}>
        Edit system {truncate(params.id as string)}
      </Link>
    )
  },
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const system: System = await prisma.system.findUniqueOrThrow({
    where: {
      id: params.id,
    },
  })
  return json(system)
}

export default function EditSystem() {
  const system = useLoaderData<typeof loader>()
  const data = useActionData<typeof action>()
  return (
    <div className="govuk-grid-row">
      <div className={`govuk-grid-column-full`}>
        <h2 className="govuk-heading-m">Edit System</h2>
        <Form method="post">
          <input hidden={true} readOnly={true} value={system.id} name="systemId" key={system.id} />
          <fieldset className="govuk-fieldset">
            <div className="govuk-form-group">
              <label className="govuk-label" htmlFor="system-id">
                System ID
              </label>
              <input
                readOnly={true}
                disabled={true}
                className="govuk-input govuk-!-width-two-thirds"
                id="system-id"
                defaultValue={system.id}
                key={system.id}
              />
            </div>
            <div className="govuk-form-group">
              <label className="govuk-label" htmlFor="system-name">
                System name
              </label>
              <input
                className="govuk-input govuk-!-width-two-thirds"
                id="system-name"
                name="systemName"
                type="text"
                defaultValue={system.name}
                key={system.id}
              />
            </div>
            <div className="govuk-form-group">
              <label className="govuk-label" htmlFor="system-description">
                System description
              </label>
              <input
                className="govuk-input govuk-!-width-two-thirds"
                id="system-description"
                name="systemDescription"
                type="text"
                defaultValue={system.description || ''}
                key={system.id}
              />
            </div>
            <div className="govuk-form-group">
              <label className="govuk-label" htmlFor="system-status">
                System Status
              </label>
              <select
                className="govuk-select"
                id="system-status"
                name="systemStatus"
                defaultValue={system.status}
                key={system.id}
              >
                {Object.values(SystemStatus).map((status) => (
                  <option key={status} value={status}>
                    {friendlyStatus(status)}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="govuk-button" data-module="govuk-button">
              Edit system
            </button>
          </fieldset>

          {data ? data.message : 'Waiting...'}
        </Form>
      </div>
    </div>
  )
}

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.formData()
  const status = body.get('systemStatus') as SystemStatus
  const name = body.get('systemName') as string
  const description = body.get('systemDescription') as string
  const id = body.get('systemId') as string
  const result = await updateSystem(id, name, description, status)
  if (result !== null && result !== undefined) {
    return redirect('/manager/systems')
  } else {
    return json({ message: `problem updating component` })
  }
}
