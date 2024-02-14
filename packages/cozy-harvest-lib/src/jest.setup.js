import minilog from '@cozy/minilog'
import '@testing-library/jest-dom/extend-expect'
import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import 'isomorphic-fetch'

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

const shouldIgnoreWarning = (message, component) => {
  /**
   * We cannot control ReactFinalForm, ReactSwipableView and Select
   * thus we ignore their warnings, this can be
   * removed when ReactFinalForm is updated and does not use
   * componentWillMount and componentWillUpdate
   */
  return (
    isComponentWillMountOrWillUpdateWarning(message) &&
    (component === 'ReactSwipableView' ||
      component === 'ReactFinalForm' ||
      component === 'Select')
  )
}

const originalConsoleWarn = console.warn // eslint-disable-line no-console
const originalConsoleError = console.error // eslint-disable-line no-console

// eslint-disable-next-line no-console
console.warn = function (message, component) {
  if (shouldIgnoreWarning(message, component)) {
    return
  } else {
    originalConsoleWarn.apply(this, arguments)
    throw new Error('console.warn should not be called during tests')
  }
}

// eslint-disable-next-line no-console
console.error = function () {
  originalConsoleError.apply(this, arguments)
  throw new Error('console.error should not be called during tests')
}

// Needed for now because `cozy-ui` can't be updated to the latest version in devDependencies
jest.mock(
  'cozy-ui/transpiled/react/Icons/CloudSync2',
  () => () => 'CloudSync2',
  {
    virtual: true
  }
)

/* Fix error: "TypeError: (0 , _color.createNodeWithThemeCssVars) is not a function" */
jest.mock('cozy-ui/transpiled/react/utils/color', () => ({
  createNodeWithThemeCssVars: () => null,
  getCssVariableValue: () => '#fff'
}))
