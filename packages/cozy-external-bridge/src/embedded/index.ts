/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-console */
import * as Comlink from 'comlink'

import { IOCozyContact } from 'cozy-client/types/types'

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
  console.log('🟣 Twake received contacts...', contacts)
  return contacts
}

const getFlag = async (key: string): Promise<string | boolean> => {
  console.log('🟣 Getting flag...')
  const flag = await availableMethods.getFlag(key)
  console.log('🟣 Twake received flag...', flag)
  return flag
}

const requestParentOrigin = (): Promise<string | undefined> => {
  return new Promise((resolve) => {
    // If we are not in an iframe, we return undefined directly
    if (window.self === window.parent) {
      return resolve(undefined)
    }

    const handleMessage = (event: any) => {
      if (event.data === "answerParentOrigin") {
        clearTimeout(timeout)
        window.removeEventListener('message', handleMessage)
        return resolve(event.origin)
      }
    };

    window.addEventListener('message', handleMessage)

    window.parent.postMessage('requestParentOrigin', '*')

    // If no answer from parent window, we return undefined after 1s
    const timeout = setTimeout(() => {
      window.removeEventListener('message', handleMessage)
      return resolve(undefined)
    }, 1000)
  });
};

const isInsideCozy = (targetOrigin: string): boolean => {
  try {
    if (!targetOrigin) return false

    const targetUrl = new URL(targetOrigin)

    return (
      targetUrl.hostname.endsWith('.twake.app') ||
      targetUrl.hostname.endsWith('.lin-saas.com') ||
      targetUrl.hostname.endsWith('.lin-saas.dev') ||
      targetUrl.hostname.endsWith('.mycozy.cloud') ||
      targetUrl.hostname.endsWith('.cozy.works') ||
      targetUrl.hostname.endsWith('.cozy.company')
    )
  } catch {
    return false
  }
}

const setupBridge = (targetOrigin: string): void => {
  if(!targetOrigin) {
    console.log('🟣 No target origin, doing nothing')
    return
  }

  console.log('🟣 Setup bridge to', targetOrigin)

  availableMethods = Comlink.wrap(
    Comlink.windowEndpoint(self.parent, self, targetOrigin)
  )

  // Full bridge
  // @ts-expect-error No type
  window._cozyBridge = {
    // @ts-expect-error No type
    ...window._cozyBridge,
    startHistorySyncing,
    stopHistorySyncing,
    getContacts,
    getFlag
  }

  console.log('🟣 Bridge ready')
}

// Default bridge
// @ts-expect-error No type
window._cozyBridge = {
  requestParentOrigin,
  isInsideCozy,
  setupBridge
}
