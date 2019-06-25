import { connect } from 'react-redux'
import context from '../redux/context'
import Overview from '../components/Overview'
import { getCompletedFields, getTotalFields } from '../redux/personalDataSlice'
import { getSlice as getAmount } from '../redux/amountSlice'
import { getSlice as getDuration } from '../redux/durationSlice'

export const mapStateToProps = state => ({
  personalDataFieldsCompleted: getCompletedFields(state),
  personalDataFieldsTotal: getTotalFields(state),
  amount: getAmount(state),
  duration: getDuration(state)
})

export default connect(
  mapStateToProps,
  null,
  null,
  { context }
)(Overview)
