export default function EventTimeline() {
  return (
    <div className="govuk-incident-timeline">
      {/*<div className="govuk-incident-timeline__item">*/}
      {/*  <div className="govuk-incident-timeline__item__header">*/}
      {/*    <strong style={{textAlign: "center", paddingLeft:"20px", paddingRight:"20px"}} className={'govuk-tag govuk-tag--green'}>Resolved</strong>*/}
      {/*  </div>*/}
      {/*  <p className="govuk-incident-timeline__item__date">*/}
      {/*    <time dateTime="2019-06-14T14:01:00.000Z">4 April 2024 at 14:09</time>*/}
      {/*  </p>*/}
      {/*  <div className="govuk-incident-timeline__item__description">*/}
      {/*    <p className={'govuk-body'}>This incident has been resolved. All delayed email notifications have now been sent.</p>*/}
      {/*  </div>*/}
      {/*</div>*/}

      <div className="govuk-incident-timeline__item">
        <div className="govuk-incident-timeline__item__header">
          <strong className={'govuk-tag'}>Monitoring</strong>
        </div>
        <p className="govuk-incident-timeline__item__date">
          <time dateTime="2019-06-14T14:01:00.000Z">4 April 2024 at 11:24</time>
        </p>
        <div className="govuk-incident-timeline__item__description">
          <p className={'govuk-body'}>
            GOV.UK Pay is fully operational. New email notifications are being sent as normal.
            <br />
            <br />
            There is a backlog of unsent email notifications from yesterday evening that are in the process of being sent now.
            <br />
            <br />
            We will continue to monitor this and will mark this incident as resolved when all emails have been sent.
          </p>
        </div>
      </div>

      <div className="govuk-incident-timeline__item">
        <div className="govuk-incident-timeline__item__header">
          <strong className={'govuk-tag govuk-tag--light-blue'}>Identified</strong>
        </div>
        <p className="govuk-incident-timeline__item__date">
          <time dateTime="2019-06-14T14:01:00.000Z">3 April 2024 at 21:35</time>
        </p>
        <div className="govuk-incident-timeline__item__description">
          <p className={'govuk-body'}>
            We have identified the issue affecting automated payment and refund notification emails. We are working to ensure that all emails are delivered.
            <br />
            <br />
            Please not that the payment pages are fully operational, payments are being received as normal. Only email notifications are affected.
            <br />
            <br />
            Email notifications for payments and refunds that occur between approximately 18:45 BST on 3 April and midnight on 4 April will be delayed. These emails will be delivered at around 10:00-11:00 on 4 April.
            <br />
            <br />
            Email notifications for payments and refunds that occur after midnight on 4 April will be sent as normal.
          </p>
        </div>
      </div>

      <div className="govuk-incident-timeline__item">
        <div className="govuk-incident-timeline__item__header">
          <strong className={'govuk-tag govuk-tag--grey'}>Update</strong>
        </div>
        <p className="govuk-incident-timeline__item__date">
          <time dateTime="2019-06-14T14:01:00.000Z">3 April 2024 at 21:19</time>
        </p>
        <div className="govuk-incident-timeline__item__description">
          <p className={'govuk-body'}>We are aware that automated emails are not currently being sent. This includes payment receipts and refund confirmations. We are investigating the issue and will provide an update soon.</p>
        </div>
      </div>

      <div className="govuk-incident-timeline__item">
        <div className="govuk-incident-timeline__item__header">
          <strong className={'govuk-tag govuk-tag--orange'}>Investigating</strong>
        </div>
        <p className="govuk-incident-timeline__item__date">
          <time dateTime="2019-06-14T14:01:00.000Z">3 April 2024 at 21:15</time>
        </p>
        <div className="govuk-incident-timeline__item__description">
          <p className={'govuk-body'}>We are currently investigating this issue.</p>
        </div>
      </div>
    </div>
  )
}
