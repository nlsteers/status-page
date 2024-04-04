import type { Component, ComponentStatus } from '@prisma/client'
import type { LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import prisma from '../.server/db'
import { Link, useLoaderData } from '@remix-run/react'
import NotificationBanner from '../ui/notificationBanner'
import Status from '../ui/base/status'

export const loader: LoaderFunction = async () => {
  const components: Component[] = await prisma.component.findMany()
  return json(components)
}

export default function Index() {
  const components = useLoaderData<Component[]>()
  return (
    <div>
      <div style={{ paddingTop: '10px' }}></div>
      <NotificationBanner intent={'success'} header={'All systems operational'} message={''} />
      <NotificationBanner intent={'error'} header={'Partial system outage'}
                          message={'Email notifications are currently unavailable'} />
      <NotificationBanner intent={'info'} header={'Scheduled maintenance in progress'}
                          message={'GOV.UK Pay will be unavailable between TIME on DATE.'} />
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

      <h1 className={'govuk-heading-l'}>Past events</h1>
      <h2 className={'govuk-heading-m'}>Apr 4</h2>


      <div className="govuk-inset-text govuk-inset-text--blue">
        <strong className="govuk-tag">Maintenance</strong>&nbsp;
        <strong className="govuk-tag govuk-tag--green">Completed</strong>

        <h3>Infrastructure upgrades</h3>
        <p>Systems affected:</p>
        <ul>
          <li>All</li>
        </ul>
        <Link to={'/event/blah'}>Incident timeline</Link>
      </div>


      <div className="govuk-inset-text govuk-inset-text--red">
        <strong className="govuk-tag govuk-tag--red">Incident</strong>&nbsp;
        <strong className="govuk-tag govuk-tag--green">Resolved</strong>

        <h3>Emails not being sent</h3>
        <p>Systems affected:</p>
        <ul>
          <li>Card Payments</li>
          <li>Email Notifications</li>
        </ul>
        <Link to={'/event/blah'}>Incident timeline</Link>
      </div>

      <h2 className={'govuk-heading-m'}>Apr 3</h2>
      <p className={'govuk-body'}>No incidents reported</p>

      <h2 className={'govuk-heading-m'}>Apr 2</h2>
      <p className={'govuk-body'}>No incidents reported</p>
    </div>
  )
}
