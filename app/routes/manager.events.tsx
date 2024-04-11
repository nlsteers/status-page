import { Link, Outlet, useLoaderData } from '@remix-run/react'
import { json, type LoaderFunction } from '@remix-run/node'
import prisma from '../.server/db'
import Status from '../ui/status'
import { type Event } from '@prisma/client'

export const handle = {
  Breadcrumb: () => <Link className={'govuk-breadcrumbs__link'} to="/manager/events">Events</Link>,
}

export const loader: LoaderFunction = async () => {
  const events: Event[] = await prisma.event.findMany()
  return json(events)
}

export default function EventsManager() {
  const events: Event[] = useLoaderData<typeof loader>()
  return (
    <div>
      <table className="govuk-table">
        {/*<caption className="govuk-table__caption govuk-table__caption--l">Events</caption>*/}
        <tbody className="govuk-table__body">
        {events.map((event: { id: string; name: string; active: boolean }) => (
          <tr className="govuk-table__row" key={event.id}>
            <th scope="row" className="govuk-table__cell">
              {event.name}
            </th>
            <td className="govuk-table__cell">
              {event.active ? <Status status={'ACTIVE'} /> : <Status status={'INACTIVE'} />}
            </td>
            <td className="govuk-table__cell govuk-table__cell--numeric">
              <Link to={`/manager/events/update/${event.id}`}>Update</Link> |{' '}
              <Link to={`/manager/events/edit/${event.id}`}>Edit</Link>
            </td>
          </tr>
        ))}
        </tbody>
      </table>

      <Link to={'/manager/events/new'}>
        <button type="button" className="govuk-button" data-module="govuk-button">
          New event
        </button>
      </Link>
      <Outlet />
    </div>
  )
}
