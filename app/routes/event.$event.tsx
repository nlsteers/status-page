import { Link } from '@remix-run/react'
import EventTimeline from '../ui/event/timeline'

export default function Event() {
  return (
    <div>
      <div style={{ paddingTop: '10px' }}></div>
      <Link to="/" className="govuk-back-link">Back</Link>
      <h1 className={'govuk-heading-l'}>EVENT ID</h1>

      <div className="govuk-inset-text govuk-inset-text--red">
        <strong className="govuk-tag govuk-tag--red">Incident</strong>&nbsp;
        <strong className="govuk-tag govuk-tag--green">Resolved</strong>

        <h3>Emails not being sent</h3>
        <p>Systems affected:</p>
        <ul>
          <li>Card Payments</li>
          <li>Email Notifications</li>
        </ul>
      </div>

      <EventTimeline />
    </div>
  )
}
