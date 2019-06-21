import { connect } from 'react-redux'
import context from '../redux/context'
import Overview from '../components/Overview'
import { getCompletedFields, getTotalFields } from '../redux/personalDataSlice'

export const mapStateToProps = state => ({
  personalDataFieldsCompleted: getCompletedFields(state),
  personalDataFieldsTotal: getTotalFields(state)
})

export default connect(
  mapStateToProps,
  null,
  null,
  { context }
)(Overview)
