import { json, type LoaderFunction } from '@remix-run/node'
import { Link, Outlet, useLoaderData } from '@remix-run/react'
import prisma from '../.server/db'
import Status from '../ui/status'
import type { System, SystemStatus } from '@prisma/client'

export const handle = {
  Breadcrumb: () => (
    <Link className={'govuk-breadcrumbs__link'} to="/manager/systems">
      Systems
    </Link>
  ),
}

export const loader: LoaderFunction = async () => {
  const systems: System[] = await prisma.system.findMany({
    orderBy: {
      name: 'asc',
    },
  })
  return json(systems)
}

export default function SystemsManager() {
  const systems: System[] = useLoaderData<typeof loader>()
  return (
    <div className="govuk-grid-row">
      <div className={`govuk-grid-column-full`}>
        <table className="govuk-table">
          <tbody className="govuk-table__body">
            {systems.map((system: { id: string; name: string; status: SystemStatus }) => (
              <tr className="govuk-table__row" key={system.id}>
                <th scope="row" className="govuk-table__cell">
                  {system.name}
                </th>
                <td className="govuk-table__cell">
                  Published status: <Status status={system.status} />
                </td>
                <td className="govuk-table__cell govuk-table__cell--numeric">
                  <Link to={`/manager/systems/edit/${system.id}`}>Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Link to={'/manager/systems/new'}>
          <button type="button" className="govuk-button" data-module="govuk-button">
            New system
          </button>
        </Link>
        <Outlet />
      </div>
    </div>
  )
}
