interface ErrorSummaryProps {
  header: string
  message: string
}

export default function ErrorSummary({ header, message }: Readonly<ErrorSummaryProps>) {
  return (
    <div className="govuk-error-summary" data-module="govuk-error-summary">
      <div role="alert">
        <h2 className="govuk-error-summary__title">
          {header}
        </h2>
        <div className="govuk-error-summary__body">
          <p className="govuk-body">{message}</p>
        </div>
      </div>
    </div>
  )
}
