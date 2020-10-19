import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import '@testing-library/jest-dom/extend-expect'
import 'isomorphic-fetch'
import minilog from '@cozy/minilog'

minilog.suggest.deny('harvest', 'warn')
minilog.suggest.deny('harvest', 'error')

configure({ adapter: new Adapter() })

const originalConsoleWarn = console.warn // eslint-disable-line no-console
// eslint-disable-next-line no-console
console.warn = function(message) {
  if (
    /**
     * We cannot control ReactFinalForm, thus we ignore the warning, this can be
     * removed when ReactFinalForm/ModalContent is updated and does not use
     * componentWillMount and componentWillUpdate
     */
    ((message.startsWith &&
      message.startsWith('Warning: componentWillMount has been renamed')) ||
      (message.startsWith &&
        message.startsWith('Warning: componentWillUpdate has been renamed'))) &&
    ((message.endsWith &&
      message.endsWith(
        'Please update the following components: ReactFinalForm'
      )) ||
      (message.endsWith &&
        message.endsWith(
          'Please update the following components: ModalContent'
        )))
  ) {
    return
  } else {
    originalConsoleWarn.apply(this, arguments)
    throw new Error('console.warn should not be called during tests')
  }
}
