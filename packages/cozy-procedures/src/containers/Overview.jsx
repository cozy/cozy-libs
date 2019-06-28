import { connect } from 'react-redux'
import context from '../redux/context'
import Overview from '../components/Overview'
import {
  getCompletedFields,
  getTotalFields,
  getData as getPersonalData
} from '../redux/personalDataSlice'
import { getSlice as getAmount } from '../redux/amountSlice'
import { getSlice as getDuration } from '../redux/durationSlice'
import { getFiles } from '../redux/documentsDataSlice'

export const mapStateToProps = state => ({
  personalDataFieldsCompleted: getCompletedFields(state),
  personalDataFieldsTotal: getTotalFields(state),
  data: {
    procedureData: {
      amount: getAmount(state),
      duration: getDuration(state)
    },
    personalData: getPersonalData(state),
    documentsData: getFiles(state)
  }
})

export default connect(
  mapStateToProps,
  null,
  null,
  { context }
)(Overview)
