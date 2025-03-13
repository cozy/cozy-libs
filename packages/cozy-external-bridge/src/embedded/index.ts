/* eslint-disable no-console */
import * as Comlink from 'comlink'

import { IOCozyContact } from 'cozy-client/types/types'

const documentReferrer = document.referrer

const isInsideCozy = (): boolean => {
  try {
    const documentReferrerUrl = new URL(documentReferrer)

    return (
      documentReferrerUrl.hostname.endsWith('.twake.app') ||
      documentReferrerUrl.hostname.endsWith('.lin-saas.com') ||
      documentReferrerUrl.hostname.endsWith('.mycozy.cloud') ||
      documentReferrerUrl.hostname.endsWith('.localhost') ||
      documentReferrerUrl.hostname.endsWith('.tools')
    )
  } catch {
    return false
  }
}

let availableMethods: {
  updateHistory: (url: string) => void
  getContacts: () => Promise<IOCozyContact>
  getFlag: (key: string) => Promise<string | boolean>
}

// eslint-disable-next-line @typescript-eslint/unbound-method
const originalPushState = history.pushState
// eslint-disable-next-line @typescript-eslint/unbound-method
const originalReplaceState = history.pushState

const onPopstate = (): void => {
  availableMethods.updateHistory(document.location.href)
}

const startHistorySyncing = (): void => {
  console.log('🟣 Starting history syncing')
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
  console.log('🟣 Stopping history syncing')
  history.pushState = originalPushState
  history.replaceState = originalReplaceState
  window.removeEventListener('popstate', onPopstate)
}

const getContacts = async (): Promise<IOCozyContact> => {
  console.log('🟣 Fetching contacts...')
  const contacts = await availableMethods.getContacts()
  return contacts
}

const getFlag = async (key: string): Promise<string | boolean> => {
  console.log('🟣 Getting flag...')
  const flag = await availableMethods.getFlag(key)
  return flag
}

console.log('🟣 Trying to connect to', documentReferrer)

if (isInsideCozy()) {
  console.log('🟣 Inside Cozy!')

  availableMethods = Comlink.wrap(
    Comlink.windowEndpoint(self.parent, self, documentReferrer)
  )

  // We start automatically the history syncing for testing purpose
  startHistorySyncing()

  // @ts-expect-error No type
  window._cozyBridge = {
    isInsideCozy,
    startHistorySyncing,
    stopHistorySyncing,
    getContacts,
    getFlag
  }
} else {
  console.log('🟣 Not inside Cozy...')
}
