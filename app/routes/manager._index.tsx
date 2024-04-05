import { Link, Outlet } from '@remix-run/react'

export default function Manager_index() {
  return (
    <div>
      <h1 className={'govuk-heading-l'}>Manager</h1>
      <ul className="govuk-list">
        <li>
          <Link to={'/manager/systems'}>
            <button role={`link`} type="button" className="govuk-button" data-module="govuk-button">
              Manage Systems
            </button>
          </Link>
        </li>
        <li>
          <Link to={'/manager/events'}>
            <button type="button" className="govuk-button" data-module="govuk-button">
              Manage Events
            </button>
          </Link>
        </li>
        <li>
          <Link to={'/'}>
            <button type="button" className="govuk-button" data-module="govuk-button">
              Home
            </button>
          </Link>
        </li>
      </ul>
      <Outlet />
    </div>
  )
}
