import { json, type LoaderFunction } from '@remix-run/node'
import type { Component, ComponentStatus } from '@prisma/client'
import { Link, Outlet, useLoaderData } from '@remix-run/react'
import prisma from '../.server/db'

export const loader: LoaderFunction = async () => {
  const components: Component[] = await prisma.component.findMany()
  return json(components)
}

export default function SystemsManager() {
  const components: Component[] = useLoaderData<typeof loader>()
  return (
    <div>
      <Link to="/manager" className="govuk-back-link">
        Back
      </Link>
      <table className="govuk-table">
        <caption className="govuk-table__caption govuk-table__caption--l">Systems</caption>
        <tbody className="govuk-table__body">
        {components
          .sort((a, b) => {
            return a.name.localeCompare(b.name)
          })
          .map((component: { id: string; name: string; status: ComponentStatus }) => (
            <tr className="govuk-table__row" key={component.id}>
              <th scope="row" className="govuk-table__cell">
                {component.name}
              </th>
              <td className="govuk-table__cell govuk-table__cell--numeric">
                <Link to={`/manager/systems/edit/${component.id}`}>Edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Link to={'/manager/systems/new'}>
        <button role={`link`} type="button" className="govuk-button" data-module="govuk-button">
          New system
        </button>
      </Link>

      <Outlet />



      <div style={{ paddingBottom: '20px' }}></div>
    </div>
  )
}
