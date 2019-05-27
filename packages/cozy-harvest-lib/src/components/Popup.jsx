import { PureComponent } from 'react'
import PropTypes from 'prop-types'

/**
 * customized function to center a popup window
 * @param  {string} url
 * @param  {string} title
 * @param  {string|number} w
 * @param  {string|number} h
 * @return {Window}       Popup window
 */
// source https://stackoverflow.com/a/16861050
export function popupCenter(url, title, w, h) {
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
  var newWindow = window.open(
    '',
    title,
    `scrollbars=yes, width=${w}, height=${h}, top=${top}, left=${left}`
  )
  newWindow.location.href = url

  // Puts focus on the newWindow
  if (newWindow.focus) {
    newWindow.focus()
  }
  return newWindow
}

/**
 * Renders a popup and listen to popup events
 */
export class Popup extends PureComponent {
  constructor(props, context) {
    super(props, context)
    this.handleMessage = this.handleMessage.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }

  componentDidMount() {
    this.showPopup()
  }

  componentWillUnmount() {
    this.killPopup()
  }

  addListeners() {
    window.addEventListener('message', this.handleMessage)
  }

  removeListeners() {
    window.removeEventListener('message', this.handleMessage)
  }

  handleMessage(messageEvent) {
    const { popup } = this.state
    const { onMessage } = this.props
    const isFromPopup = popup.location.origin === messageEvent.origin
    if (isFromPopup && typeof onMessage === 'function') onMessage(messageEvent)
  }

  handleClose(popup) {
    this.removeListeners(popup)

    const { onClose } = this.props
    if (typeof onClose === 'function') onClose(popup)
  }

  showPopup() {
    const { height, width, title, url } = this.props
    const popup = popupCenter(url, title, width, height)
    this.addListeners(popup)
    this.startMonitoringClosing(popup)
    this.setState({ popup })
  }

  killPopup() {
    this.removeListeners()
    this.stopMonitoringClosing()
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
  onMessage: PropTypes.func
}

Popup.defaultProps = {
  title: ''
}

export default Popup
