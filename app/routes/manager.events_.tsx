import { Link, Outlet, useLoaderData } from '@remix-run/react'
import { json, LoaderFunction } from '@remix-run/node'
import type { Incident } from '@prisma/client'
import prisma from '../.server/db'
import Status from '../ui/status'

export const loader: LoaderFunction = async () => {
  const incidents: Incident[] = await prisma.incident.findMany()
  return json(incidents)
}

export default function EventsManager() {
  const incidents: Incident[] = useLoaderData<typeof loader>()
  return (
    <div>
      <Link to="/manager" className="govuk-back-link">
        Back
      </Link>
      <table className="govuk-table">
        <caption className="govuk-table__caption govuk-table__caption--l">Events</caption>
        <tbody className="govuk-table__body">
          {incidents.map((incident: { id: string; name: string; active: boolean }) => (
            <tr className="govuk-table__row" key={incident.id}>
              <th scope="row" className="govuk-table__cell">
                {incident.name}
              </th>
              <td className="govuk-table__cell">
                {incident.active ? <Status status={'ACTIVE'} /> : <Status status={'INACTIVE'} />}
              </td>
              <td className="govuk-table__cell govuk-table__cell--numeric">
                <Link to={`/manager/events/update/${incident.id}`}>Update</Link> |{' '}
                <Link to={`/manager/events/edit/${incident.id}`}>Edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Link to={'/manager/events/new'}>
        <button role={`link`} type="button" className="govuk-button" data-module="govuk-button">
          New event
        </button>
      </Link>
      <Outlet />

      <div style={{ paddingBottom: '20px' }}></div>
    </div>
  )
}
