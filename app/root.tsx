import type { LinksFunction, MetaFunction } from '@remix-run/node'
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react'
import { Header, PhaseBanner, Footer } from './ui/base'
import { useEffect } from 'react'
import './styles/global.css'

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: '/styles/govuk-frontend.min.css' },
  { rel: 'manifest', href: '/assets/manifest.json' },
  { rel: 'icon', sizes: '48x48', href: '/assets/images/favicon.ico' },
  { rel: 'icon', sizes: 'any', href: '/assets/images/favicon.svg', type: 'image/svg+xml' },
  { rel: 'mask-icon', href: '/assets/images/govuk-icon-mask.svg', color: '#0b0c0c' },
  { rel: 'apple-touch-icon', href: '/assets/images/govuk-icon-180.png' },
]

export const meta: MetaFunction = () => [
  { charSet: 'utf-8' },
  {
    name: 'viewport',
    content: 'width=device-width, initial-scale=1, viewport-fit=cover',
  },
  { name: 'theme-color', content: '#0b0c0c' },
]

function useGovUkFrontendJavascript(scriptsDir: string) {
  useEffect(() => {
    const frontendSupported = document.createElement('script')
    frontendSupported.textContent = `
      document.body.className += ' js-enabled' + ('noModule' in HTMLScriptElement.prototype ? ' govuk-frontend-supported' : '');
    `
    const frontendJavascript = document.createElement('script')
    frontendJavascript.type = 'module'
    frontendJavascript.src = `/${scriptsDir}/govuk-frontend.min.js`
    const init = document.createElement('script')
    init.type = 'module'
    init.textContent = `
      import { initAll } from '/${scriptsDir}/govuk-frontend.min.js';
      initAll();
    `
    document.body.appendChild(frontendSupported)
    document.body.appendChild(frontendJavascript)
    document.body.appendChild(init)
    // unmount
    return () => {
      document.body.removeChild(frontendSupported)
      document.body.removeChild(frontendJavascript)
      document.body.removeChild(init)
    }
  }, [scriptsDir])
}

export default function App() {
  useGovUkFrontendJavascript('scripts')
  return (
    <html lang="en">
      <head>
        <title>GOV.UK Pay Status</title>
        <Meta />
        <Links />
      </head>
      <body className="govuk-template__body app-body-class">
        <Header title="Status" />
        <div className="govuk-width-container" style={{ minHeight: '80vh' }}>
          <PhaseBanner />
          <div style={{ paddingTop: '10px' }}></div>
          <Outlet />
        </div>
        <Footer />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}
