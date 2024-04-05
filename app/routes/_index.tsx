import type { Component } from '@prisma/client'
import { ComponentStatus } from '@prisma/client'
import type { LoaderFunction } from '@remix-run/node'
import prisma from '../.server/db'
import { Link, useLoaderData } from '@remix-run/react'
import NotificationBanner from '../ui/notificationBanner'
import Status from '../ui/status'

interface IndexLoaderData {
  components: Component[]
  allOperational: boolean
}

export const loader: LoaderFunction = async (): Promise<IndexLoaderData> => {
  const components: Component[] = await prisma.component.findMany()
  const allOperational = components.every((component : Component) : boolean => component.status === ComponentStatus.OPERATIONAL)
  return { components, allOperational }
}

export default function _index() {
  const { components, allOperational } = useLoaderData<IndexLoaderData>()
  return (
    <div>
      {allOperational && <NotificationBanner intent={'success'} header={'All systems operational'} message={''} />}
      <NotificationBanner
        intent={'error'}
        header={'Partial system outage'}
        message={'Email notifications are currently unavailable'}
      />
      {/*<NotificationBanner intent={'info'} header={'Scheduled maintenance in progress'}*/}
      {/*                    message={'GOV.UK Pay will be unavailable between TIME on DATE'} />*/}
      <table className="govuk-table">
        <caption className="govuk-table__caption govuk-table__caption--l">System overview</caption>
        <tbody className="govuk-table__body">
        {components
          .sort((a, b) => {
            return a.name.localeCompare(b.name)
          })
          .map((component: { id: string; name: string; status: ComponentStatus }) => (
            <tr className="govuk-table__row" key={component.id}>
              <th scope="row" className="govuk-table__header">
                {component.name}
              </th>
              <td className="govuk-table__cell govuk-table__cell--numeric">
                <Status status={component.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h1 className={'govuk-heading-l'}>Active events</h1>

      <div className="govuk-inset-text govuk-inset-text--red">
        <strong className="govuk-tag govuk-tag--red">Incident</strong>&nbsp;
        <strong className="govuk-tag">Monitoring</strong>
        <h3>Email notifications are currently unavailable</h3>
        <p>Systems affected:</p>
        <ul>
          <li>Email Notifications</li>
        </ul>
        <p>
          Last updated: <time dateTime="2019-06-14T14:01:00.000Z">4 April 2024 at 14:09</time>
        </p>
        <Link to={'/event/blah'} className={'govuk-link'}>See timeline</Link>
      </div>

      <div className="govuk-inset-text govuk-inset-text--red">
        <strong className="govuk-tag govuk-tag--red">Incident</strong>&nbsp;
        <strong className="govuk-tag govuk-tag--orange">Investigating</strong>
        <h3>Example incident </h3>
        <p>Systems affected:</p>
        <ul>
          <li>Stripe</li>
        </ul>
        <p>
          Last updated: <time dateTime="2019-06-14T14:01:00.000Z">4 April 2024 at 14:09</time>
        </p>
        <Link to={'/'} className={'govuk-link'}>See timeline</Link>
      </div>

      <Link to={'/pastEvents'} className={'govuk-link'}>Event history &gt;</Link>
      <br/>
      <div style={{ paddingBottom: '20px' }}></div>
    </div>
  )
}
