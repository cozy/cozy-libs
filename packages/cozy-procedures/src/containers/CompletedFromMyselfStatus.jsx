import CompletedFromMyselfStatus from '../components/CompletedFromMyselfStatus'
import connectWithProcedures from '../redux/connectWithProcedures'
import {
  getCompletedFromMyself,
  getTotalFields
} from '../redux/personalDataSlice'

export const mapStateToProps = state => ({
  completed: getCompletedFromMyself(state),
  total: getTotalFields(state)
})

export default connectWithProcedures(mapStateToProps)(CompletedFromMyselfStatus)
