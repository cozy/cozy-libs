import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import '@testing-library/jest-dom/extend-expect'
import 'isomorphic-fetch'
import minilog from 'minilog'

minilog.suggest.deny('harvest', 'warn')
minilog.suggest.deny('harvest', 'error')

configure({ adapter: new Adapter() })

const originalConsoleWarn = console.warn // eslint-disable-line no-console
// eslint-disable-next-line no-console
console.warn = function(message) {
  if (
    /**
     * We cannot control ReactFinalForm, thus we ignore the warning, this can be
     * removed when ReactFinalForm is updated and does not use componentWillMount
     * and componentWillUpdate
     */
    (message.startsWith('Warning: componentWillMount has been renamed') ||
      message.startsWith('Warning: componentWillUpdate has been renamed')) &&
    message.endsWith('Please update the following components: ReactFinalForm')
  ) {
    return
  } else {
    return originalConsoleWarn.apply(this, arguments)
  }
}
