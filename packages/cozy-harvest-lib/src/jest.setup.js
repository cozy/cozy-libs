import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import '@testing-library/jest-dom/extend-expect'
import 'isomorphic-fetch'
import minilog from '@cozy/minilog'

minilog.suggest.deny('harvest', 'warn')
minilog.suggest.deny('harvest', 'error')

configure({ adapter: new Adapter() })

const isComponentWillMountOrWillUpdateWarning = message => {
  return (
    message.startsWith('Warning: componentWillMount has been renamed') ||
    message.startsWith('Warning: componentWillUpdate has been renamed') ||
    message.startsWith('Warning: componentWillReceiveProps has been renamed')
  )
}

const isWarningForComponent = (message, Component) => {
  return message.endsWith(
    `Please update the following components: ${Component}`
  )
}

const shouldIgnoreWarning = message => {
  /**
   * We cannot control ReactFinalForm, ReactSwipableView and Select
   * thus we ignore their warnings, this can be
   * removed when ReactFinalForm is updated and does not use
   * componentWillMount and componentWillUpdate
   */
  return (
    isComponentWillMountOrWillUpdateWarning(message) &&
    (isWarningForComponent(message, 'ReactSwipableView') ||
      isWarningForComponent(message, 'ReactFinalForm') ||
      isWarningForComponent(message, 'Select'))
  )
}

const originalConsoleWarn = console.warn // eslint-disable-line no-console
// eslint-disable-next-line no-console
console.warn = function(message) {
  if (shouldIgnoreWarning(message)) {
    return
  } else {
    originalConsoleWarn.apply(this, arguments)
    throw new Error('console.warn should not be called during tests')
  }
}
