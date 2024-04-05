import { Link } from '@remix-run/react'

export default function PastEvents() {
  return (
    <div>
      <Link to="/" className="govuk-back-link">
        Back
      </Link>
      <h1 className={'govuk-heading-l'}>Past events</h1>

      <h2 className={'govuk-heading-m'}>April 2024</h2>
      <p className={`govuk-body`}>No events reported</p>

      <h2 className={'govuk-heading-m'}>March 2024</h2>
      <p className={`govuk-body`}>No events reported</p>

      <h2 className={'govuk-heading-m'}>February 2024</h2>
      <div className="govuk-inset-text govuk-inset-text--blue">
        <strong className="govuk-tag">Maintenance</strong>&nbsp;
        <strong className="govuk-tag govuk-tag--green">Completed</strong>
        <h3>Infrastructure upgrades</h3>
        <p>Systems affected:</p>
        <ul>
          <li>All</li>
        </ul>
      </div>

      <h2 className={'govuk-heading-m'}>January 2024</h2>
      <p className={`govuk-body`}>No events reported</p>
    </div>
  )
}
