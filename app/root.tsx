import {
  Links,
  Meta,
  Outlet,
  Scripts,
} from "@remix-run/react"
import './styles/global.css'

import {useEffect} from "react"

function useGovUkFrontendJavascript(scriptsDir: string) {
  useEffect(() => {
    const frontendSupported = document.createElement("script")
    frontendSupported.textContent = `
      document.body.className += ' js-enabled' + ('noModule' in HTMLScriptElement.prototype ? ' govuk-frontend-supported' : '');
    `
    const frontendJavascript = document.createElement("script")
    frontendJavascript.type = "module"
    frontendJavascript.src = `/${scriptsDir}/govuk-frontend.min.js`
    const init = document.createElement("script")
    init.type = "module";
    init.textContent = `
      import { initAll } from '/${scriptsDir}/govuk-frontend.min.js';
      initAll();
    `
    document.body.appendChild(frontendSupported)
    document.body.appendChild(frontendJavascript)
    document.body.appendChild(init);
    // unmount
    return () => {
      document.body.removeChild(frontendSupported)
      document.body.removeChild(frontendJavascript)
      document.body.removeChild(init)
    };
  }, [])
}

export default function App() {
  useGovUkFrontendJavascript("scripts")
  return (
    <html lang="en">
    <head>
      <meta charSet="utf-8"/>
      <title>Pay Status</title>
      <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"/>
      <meta name="theme-color" content="#0b0c0c"/>
      <link rel="icon" sizes="48x48" href="/assets/images/favicon.ico"/>
      <link rel="icon" sizes="any" href="/assets/images/favicon.svg" type="image/svg+xml"/>
      <link rel="mask-icon" href="/assets/images/govuk-icon-mask.svg" color="#0b0c0c"/>
      <link rel="apple-touch-icon" href="/assets/images/govuk-icon-180.png"/>
      <link rel="manifest" href="/assets/manifest.json"/>
      <link rel="stylesheet" href="/styles/govuk-frontend.min.css"/>
      <title>GOV.UK Pay Status</title>
      <Meta/>
      <Links/>
    </head>
    <body>
    <h1 className="govuk-heading-l">govuk-heading-l</h1>
    <h2 className="govuk-heading-m">govuk-heading-m</h2>
    <h3 className="govuk-heading-s">govuk-heading-s</h3>
    <button className="govuk-button">hello</button>
    <Outlet/>

    <Scripts/>
    </body>
    </html>
  )
}
