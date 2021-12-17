import { connect } from 'react-redux'

import context from './context'

const connectWithProcedures = (
  mapStateToProps,
  mapDispatchToProps = null,
  mergeProps = null,
  otherOptions = {}
) =>
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
    { ...otherOptions, context }
  )

export default connectWithProcedures
