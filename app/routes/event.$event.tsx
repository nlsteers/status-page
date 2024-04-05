import type { LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Link } from '@remix-run/react'
import EventTimeline from '../ui/event/timeline'
import Status from '../ui/status'
import type { IncidentUpdate } from '@prisma/client'
import prisma from '../.server/db'

export const loader: LoaderFunction = async () => {
  const incidentUpdates: IncidentUpdate[] = await prisma.incidentUpdate.findMany()
  return json(incidentUpdates)
}


export default function Event() {
  return (
    <div>
      <Link to="/" className="govuk-back-link">
        Back
      </Link>
      <h1 className={'govuk-heading-l'}>Emails not being sent</h1>
      <p className={'govuk-body'}>Event ID: d15e312d-f20c-4134-998a-5958aa35f48e</p>

      <table className="govuk-table">
        <thead className="govuk-table__head">
          <tr className="govuk-table__row">
            <th scope="col" className="govuk-table__header govuk-!-width-one-quarter">
            </th>
            <th scope="col" className="govuk-table__header">
            </th>
          </tr>
        </thead>
        <tbody className="govuk-table__body">
          <tr className="govuk-table__row">
            <th scope="row" className="govuk-table__header">
              Type
            </th>
            <td className="govuk-table__cell govuk-table__cell--numeric">
              <strong className="govuk-tag govuk-tag--red">
                Incident
              </strong>
            </td>
          </tr>
          <tr className="govuk-table__row">
            <th scope="row" className="govuk-table__header">
              Status
            </th>
            <td className="govuk-table__cell govuk-table__cell--numeric">
              <strong className="govuk-tag">
                Monitoring
              </strong>
            </td>
          </tr>
        </tbody>
      </table>

      <EventTimeline />
    </div>
  )
}
