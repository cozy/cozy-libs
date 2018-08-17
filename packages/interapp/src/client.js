import { errorSerializer, pickService } from './helpers'
import { create as createIntent } from './'

const intentClass = 'coz-intent'

function hideIntentIframe(iframe) {
  iframe.style.display = 'none'
}

function showIntentFrame(iframe) {
  iframe.style.display = 'block'
}

function buildIntentIframe(intent, element, url) {
  const document = element.ownerDocument
  if (!document)
    return Promise.reject(
      new Error('Cannot retrieve document object from given element')
    )

  const iframe = document.createElement('iframe')
  // TODO: implement 'title' attribute
  iframe.setAttribute('id', `intent-${intent._id}`)
  iframe.setAttribute('src', url)
  iframe.classList.add(intentClass)
  return iframe
}

function injectIntentIframe(intent, element, url, options) {
  const { onReadyCallback } = options
  const iframe = buildIntentIframe(
    intent,
    element,
    url,
    options.onReadyCallback
  )
  // if callback provided for when iframe is loaded
  if (typeof onReadyCallback === 'function') iframe.onload = onReadyCallback
  element.appendChild(iframe)
  iframe.focus()
  return iframe
}

// inject iframe for service in given element
function connectIntentIframe(cozy, iframe, element, intent, data) {
  const document = element.ownerDocument
  if (!document)
    return Promise.reject(
      new Error('Cannot retrieve document object from given element')
    )

  const window = document.defaultView
  if (!window)
    return Promise.reject(
      new Error('Cannot retrieve window object from document')
    )

  // Keeps only http://domain:port/
  const serviceOrigin = iframe.src.split('/', 3).join('/')

  async function compose(cozy, action, doctype, data) {
    const intent = await createIntent(cozy, action, doctype, data)
    hideIntentIframe(iframe)
    const doc = await start(cozy, intent, element, {
      ...data,
      exposeIntentFrameRemoval: false
    })
    showIntentFrame(iframe)
    return doc
  }

  return new Promise((resolve, reject) => {
    let handshaken = false
    const messageHandler = async event => {
      if (event.origin !== serviceOrigin) return

      const eventType = event.data.type
      if (eventType === 'load') {
        // Safari 9.1 (At least) send a MessageEvent when the iframe loads,
        // making the handshake fails.
        console.warn &&
          console.warn(
            'Cozy Client ignored MessageEvent having data.type `load`.'
          )
        return
      }

      if (eventType === `intent-${intent._id}:ready`) {
        handshaken = true
        return event.source.postMessage(data, event.origin)
      }

      if (handshaken && eventType === `intent-${intent._id}:resize`) {
        ;['width', 'height', 'maxWidth', 'maxHeight'].forEach(prop => {
          if (event.data.transition)
            element.style.transition = event.data.transition
          if (event.data.dimensions[prop])
            element.style[prop] = `${event.data.dimensions[prop]}px`
        })

        return true
      }

      if (handshaken && eventType === `intent-${intent._id}:compose`) {
        // Let start to name `type` as `doctype`, as `event.data` already have a `type` attribute.
        const { action, doctype, data } = event.data
        const doc = await compose(cozy, action, doctype, data)
        return event.source.postMessage(doc, event.origin)
      }

      window.removeEventListener('message', messageHandler)
      const removeIntentFrame = () => {
        // check if the parent node has not been already removed from the DOM
        iframe.parentNode && iframe.parentNode.removeChild(iframe)
      }

      if (
        handshaken &&
        eventType === `intent-${intent._id}:exposeFrameRemoval`
      ) {
        return resolve({ removeIntentFrame, doc: event.data.document })
      }

      removeIntentFrame()

      if (eventType === `intent-${intent._id}:error`) {
        return reject(errorSerializer.deserialize(event.data.error))
      }

      if (handshaken && eventType === `intent-${intent._id}:cancel`) {
        return resolve(null)
      }

      if (handshaken && eventType === `intent-${intent._id}:done`) {
        return resolve(event.data.document)
      }

      if (!handshaken) {
        return reject(
          new Error('Unexpected handshake message from intent service')
        )
      }

      // We may be in a state where the messageHandler is still attached to then
      // window, but will not be needed anymore. For example, the service failed
      // before adding the `unload` listener, so no `intent:cancel` message has
      // never been sent.
      // So we simply ignore other messages, and this listener will stay here,
      // waiting for a message which will never come, forever (almost).
    }

    window.addEventListener('message', messageHandler)
  })
}

export function start(cozy, intent, element, data = {}, options = {}) {
  const service = pickService(intent, options.filterServices)

  if (!service) {
    throw new Error('Unable to find a service')
  }

  const iframe = injectIntentIframe(intent, element, service.href, options)

  return connectIntentIframe(
    cozy,
    iframe,
    element,
    intent,
    data,
    options.onReadyCallback
  )
}
