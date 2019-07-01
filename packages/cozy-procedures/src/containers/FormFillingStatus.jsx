import { connect } from 'react-redux'

import context from '../redux/context'
import FormFillingStatus from '../components/FormFillingStatus'
import {
  getCompletedFromMyself,
  getTotalFields
} from '../redux/personalDataSlice'

export const mapStateToProps = state => ({
  completed: getCompletedFromMyself(state),
  total: getTotalFields(state)
})

export default connect(
  mapStateToProps,
  null,
  null,
  { context }
)(FormFillingStatus)
