/* eslint-disable no-console */
import * as Comlink from 'comlink'

import { IOCozyContact } from 'cozy-client/types/types'

const documentReferrer = document.referrer

const isInsideCozy = (): boolean => {
  try {
    const documentReferrerUrl = new URL(documentReferrer)

    return (
      documentReferrerUrl.hostname.endsWith('.mycozy.cloud') ||
      documentReferrerUrl.hostname.endsWith('.localhost')
    )
  } catch {
    return false
  }
}

let availableMethods: {
  updateHistory: (url: string) => void
  getContacts: () => Promise<IOCozyContact>
}

// eslint-disable-next-line @typescript-eslint/unbound-method
const originalPushState = history.pushState
// eslint-disable-next-line @typescript-eslint/unbound-method
const originalReplaceState = history.pushState

const onPopstate = (): void => {
  availableMethods.updateHistory(document.location.href)
}

const startHistorySyncing = (): void => {
  history.pushState = (state, title, url): void => {
    originalPushState.call(history, state, title, url)
    if (url) {
      availableMethods.updateHistory(url.toString())
    }
  }

  history.replaceState = (state, title, url): void => {
    originalReplaceState.call(history, state, title, url)
    if (url) {
      availableMethods.updateHistory(url.toString())
    }
  }

  window.addEventListener('popstate', onPopstate)
}

const stopHistorySyncing = (): void => {
  history.pushState = originalPushState
  history.replaceState = originalReplaceState
  window.removeEventListener('popstate', onPopstate)
}

const getContacts = async (): Promise<IOCozyContact> => {
  console.log('🟣 Fetching contacts...')
  const contacts = await availableMethods.getContacts()
  return contacts
}

console.log('🟣 Trying to connect to', documentReferrer)

if (isInsideCozy()) {
  console.log('🟣 Inside Cozy!')

  availableMethods = Comlink.wrap(
    Comlink.windowEndpoint(self.parent, self, documentReferrer)
  )

  // @ts-expect-error No type
  window._isInsideCozy = isInsideCozy
  // @ts-expect-error No type
  window._startHistorySyncing = startHistorySyncing
  // @ts-expect-error No type
  window._stopHistorySyncing = stopHistorySyncing
  // @ts-expect-error No type
  window._getContacts = getContacts
} else {
  console.log('🟣 Not inside Cozy...')
}
