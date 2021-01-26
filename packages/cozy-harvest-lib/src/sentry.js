import * as Sentry from '@sentry/browser'

/**
 * Creates a Sentry client connected to the Harvest project
 *
 * @param {SentryClient}
 */
export const client = new Sentry.BrowserClient({
  dsn: 'https://888abd94993a47a39e751598fc6be803@sentry.cozycloud.cc/145',
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
