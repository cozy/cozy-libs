import { connect } from 'react-redux'

import connectWithProcedures from './connectWithProcedures'
import context from './context'

jest.mock('react-redux')

describe('connectWithProcedures', () => {
  it('should connect the component with procedures context', () => {
    const mapStateToProps = state => ({ foo: state.foo })
    connectWithProcedures(mapStateToProps)
    expect(connect).toHaveBeenCalledWith(mapStateToProps, null, null, {
      context
    })
  })
})
