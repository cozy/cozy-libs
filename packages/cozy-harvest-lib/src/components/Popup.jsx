import { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { isMobileApp } from 'cozy-device-helper'

/**
 * Customized function to get dimensions and position for a centered
 * popup window
 * @param  {string} url
 * @param  {string} title
 * @param  {string|number} w
 * @param  {string|number} h
 * @return {{w, h, top, left}}       Popup window
 */
// source https://stackoverflow.com/a/16861050
export function popupCenter(w, h) {
  /* global screen */
  // Fixes dual-screen position
  //                      Most browsers      Firefox
  var dualScreenLeft = window.screenLeft || screen.left
  var dualScreenTop = window.screenTop || screen.top

  var width = window.innerWidth
    ? window.innerWidth
    : document.documentElement.clientWidth
    ? document.documentElement.clientWidth
    : screen.width
  var height = window.innerHeight
    ? window.innerHeight
    : document.documentElement.clientHeight
    ? document.documentElement.clientHeight
    : screen.height

  var left = width / 2 - w / 2 + dualScreenLeft
  var top = height / 2 - h / 2 + dualScreenTop
  // need to be set here to get from the OAuth opener
  return {
    w,
    h,
    top,
    left
  }
}

/**
 * Renders a popup and listen to popup events
 */
export class Popup extends PureComponent {
  constructor(props, context) {
    super(props, context)
    this.handleClose = this.handleClose.bind(this)
    this.handleMessage = this.handleMessage.bind(this)
    this.handleUrlChange = this.handleUrlChange.bind(this)
  }

  componentDidMount() {
    this.showPopup()
  }

  componentWillUnmount() {
    this.killPopup()
  }

  addListeners(popup) {
    // Listen here for message FROM popup
    window.addEventListener('message', this.handleMessage)

    // rest of instructions only on mobile app
    if (!isMobileApp()) return
    popup.addEventListener('loadstart', this.handleUrlChange)
    popup.addEventListener('exit', this.handleClose)
  }

  removeListeners(popup) {
    window.removeEventListener('message', this.handleMessage)

    // rest of instructions only if popup is still opened
    if (popup.closed) return

    // rest of instructions only on mobile app
    if (!isMobileApp()) return
    popup.removeEventListener('loadstart', this.handleUrlChange)
    popup.removeEventListener('exit', this.handleClose)
  }

  handleMessage(messageEvent) {
    const { popup } = this.state
    const { onMessage } = this.props
    const isFromPopup = popup.location.origin === messageEvent.origin
    if (isFromPopup && typeof onMessage === 'function') onMessage(messageEvent)
  }

  handleClose(popup) {
    this.killPopup()

    const { onClose } = this.props
    if (typeof onClose === 'function') onClose(popup)
  }

  showPopup() {
    const { height, width, title, url } = this.props
    const { w, h, top, left } = popupCenter(width, height)
    /**
     * ATM we also use window.open on Native App in order to open
     * InAppBrowser. But some provider (Google for instance) will
     * block us. We need to use a SafariViewController or Chrome Custom Tab.
     * So
     */
    const popup = window.open(
      url,
      title,
      `scrollbars=yes, width=${w}, height=${h}, top=${top}, left=${left}`
    )
    // Puts focus on the newWindow
    if (popup.focus) {
      popup.focus()
    }

    this.addListeners(popup)
    this.startMonitoringClosing(popup)
    this.setState({ popup })
  }

  killPopup() {
    const { popup } = this.state
    this.removeListeners(popup)
    this.stopMonitoringClosing()
    if (!popup.closed) popup.close()
  }

  monitorClosing(popup) {
    if (popup.closed) {
      this.stopMonitoringClosing()
      return this.handleClose(popup)
    }
  }

  /**
   * Check if window is closing every 500ms
   * @param  {Window} window
   */
  startMonitoringClosing(popup) {
    this.checkClosedInterval = setInterval(
      () => this.monitorClosing(popup),
      500
    )
  }

  stopMonitoringClosing() {
    clearInterval(this.checkClosedInterval)
  }

  handleUrlChange(event) {
    const { url } = event
    const { onUrlChange } = this.props
    if (typeof onUrlChange === 'function') onUrlChange(new URL(url))
  }

  render() {
    return null
  }
}

Popup.propTypes = {
  // Dimensions
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  title: PropTypes.string,
  url: PropTypes.string.isRequired,
  // Callbacks
  onClose: PropTypes.func,
  onMessage: PropTypes.func,
  onUrlChange: PropTypes.func
}

Popup.defaultProps = {
  title: ''
}

export default Popup
