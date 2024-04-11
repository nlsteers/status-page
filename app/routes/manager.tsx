import { Link, Outlet, type UIMatch, useMatches } from '@remix-run/react'

export const handle = {
  Breadcrumb: () => (
    <Link className={'govuk-breadcrumbs__link'} to="/manager">
      Manager
    </Link>
  ),
}

export default function Manager() {
  const matches: UIMatch[] = useMatches()
  return (
    <div>
      <div className={`govuk-grid-row`}>
        <div className={`govuk-grid-column-one-third`}>
          <ul className="govuk-list">
            <li>
              <Link className={'govuk-link govuk-link--no-visited-state govuk-link--no-underline'} to={'/manager/systems'}>Manage Systems</Link>
            </li>
            <li>
              <Link className={'govuk-link govuk-link--no-visited-state govuk-link--no-underline'} to={'/manager/events'}>Manage Events</Link>
            </li>
          </ul>
        </div>
        <div className={`govuk-grid-column-two-thirds`}>
          <div className="govuk-breadcrumbs">
            <ol className="govuk-breadcrumbs__list">
              {matches
                // @ts-ignore
                .filter((match) => match.handle?.Breadcrumb)
                .map((match) => (
                  <li className="govuk-breadcrumbs__list-item" key={match.id}>
                    {
                      // @ts-ignore
                      match.handle.Breadcrumb(match)
                    }
                  </li>
                ))}
            </ol>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
