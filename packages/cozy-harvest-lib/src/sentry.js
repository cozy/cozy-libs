import * as Sentry from '@sentry/browser'

/**
 * Creates a Sentry client connected to the Harvest project
 *
 * @param {SentryClient}
 */
export const client = new Sentry.BrowserClient({
  dsn: 'https://1f8d191bad884bf98ae8cdcb6f6abb72@errors.cozycloud.cc/39',
  integrations: Sentry.defaultIntegrations,
  beforeSend(event) {
    if (process.env.NODE_ENV !== 'production') {
      return null
    }
    return event
  }
})

export const hub = new Sentry.Hub(client)

export default hub
