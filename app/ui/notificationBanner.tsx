interface NotificationProps {
  intent: string
  header: string
  messages: string[]
}

export default function NotificationBanner({ intent, header, messages }: Readonly<NotificationProps>) {
  return (
    <div className={`govuk-notification-banner govuk-notification-banner--${intent}`} role="alert" aria-labelledby="govuk-notification-banner-title" data-module="govuk-notification-banner">
      <div className="govuk-notification-banner__header">
        <h2 className="govuk-notification-banner__title" id="govuk-notification-banner-title">
          Information
        </h2>
      </div>
      <div className="govuk-notification-banner__content">
        <h3 className="govuk-notification-banner__heading">{header}</h3>
        <ul className={`govuk-list`}>
          {messages.map((message: string, index: number) => (
            <li className="govuk-body" key={index}>{message}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
