import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

jest.mock('cozy-logger', () => ({
  namespace: () => () => {}
}))
Enzyme.configure({ adapter: new Adapter() })
