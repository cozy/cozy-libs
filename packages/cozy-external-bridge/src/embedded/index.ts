/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-console */
import * as Comlink from 'comlink'

import { IOCozyContact } from 'cozy-client/types/types'

let availableMethods: {
  updateHistory: (url: string) => void
  getContacts: () => Promise<IOCozyContact>
  getFlag: (key: string) => Promise<string | boolean>
  createDocs: (data: object) => Promise<object>
  updateDocs: (data: object) => Promise<object>
  requestNotificationPermission: () => Promise<NotificationPermission>
  sendNotification: (data: { title: string; body: string }) => Promise<void>
  search: (searchQuery: string) => Promise<object[]>
}

// eslint-disable-next-line @typescript-eslint/unbound-method
const originalPushState = history.pushState
// eslint-disable-next-line @typescript-eslint/unbound-method
const originalReplaceState = history.replaceState

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

const createDocs = async (data: object): Promise<object> => {
  console.log('🟣 Creating file...')
  const createdDocs = await availableMethods.createDocs(data)
  console.log('🟣 Twake received created file...', createdDocs)
  return createdDocs
}

const updateDocs = async (data: object): Promise<object> => {
  console.log('🟣 Updating data...')
  const updatedDocs = await availableMethods.updateDocs(data)
  console.log('🟣 Twake received updated file...', updatedDocs)
  return updatedDocs
}

const search = async (searchQuery: string): Promise<object[]> => {
  console.log('🟣 Search...')
  const results = await availableMethods.search(searchQuery)
  console.log('🟣 Search results: ', results)
  return results
}

const requestNotificationPermission =
  async (): Promise<NotificationPermission> => {
    console.log('🟣 Requesting notification permission...')
    const notificationPermission =
      await availableMethods.requestNotificationPermission()
    console.log(
      '🟣 Notification permission request result: ',
      notificationPermission
    )
    return notificationPermission
  }

const sendNotification = async (data: {
  title: string
  body: string
}): Promise<void> => {
  console.log('🟣 Sending notification...')
  await availableMethods.sendNotification(data)
  console.log('🟣 Notification sent')
}

const requestParentOrigin = (): Promise<string | undefined> => {
  return new Promise(resolve => {
    // If we are not in an iframe, we return undefined directly
    if (window.self === window.parent) {
      return resolve(undefined)
    }

    const handleMessage = (event: MessageEvent): void => {
      if (event.data === 'answerParentOrigin') {
        clearTimeout(timeout)
        window.removeEventListener('message', handleMessage)
        return resolve(event.origin)
      }
    }

    window.addEventListener('message', handleMessage)

    window.parent.postMessage('requestParentOrigin', '*')

    // If no answer from parent window, we return undefined after 1s
    const timeout = setTimeout(() => {
      window.removeEventListener('message', handleMessage)
      return resolve(undefined)
    }, 1000)
  })
}

const isInsideCozy = (targetOrigin: string): boolean => {
  try {
    if (!targetOrigin) return false

    const targetUrl = new URL(targetOrigin)

    return (
      targetUrl.hostname.endsWith('.linagora.com') ||
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
  if (!targetOrigin) {
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
    getFlag,
    createDocs,
    updateDocs,
    requestNotificationPermission,
    sendNotification,
    search
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
