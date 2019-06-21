import { connect } from 'react-redux'

import context from '../redux/context'
import FormFillingStatus from '../components/FormFillingStatus'
import { getCompletedFields, getTotalFields } from '../redux/personalDataSlice'

export const mapStateToProps = state => ({
  completed: getCompletedFields(state),
  total: getTotalFields(state)
})

export default connect(
  mapStateToProps,
  null,
  null,
  { context }
)(FormFillingStatus)
