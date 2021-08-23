import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import '@testing-library/jest-dom/extend-expect'

jest.mock('cozy-logger', () => ({
  namespace: () => () => {}
}))
Enzyme.configure({ adapter: new Adapter() })
