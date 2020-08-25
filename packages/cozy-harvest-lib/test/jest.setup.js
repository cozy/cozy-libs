import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import '@testing-library/jest-dom/extend-expect'
import 'isomorphic-fetch'
import minilog from 'minilog'

minilog.suggest.deny('harvest', 'warn')
minilog.suggest.deny('harvest', 'error')

configure({ adapter: new Adapter() })
