import connectWithProcedures from '../redux/connectWithProcedures'
import Overview from '../components/overview/Overview'
import {
  getCompletedFields,
  getTotalFields,
  getData as getPersonalData
} from '../redux/personalDataSlice'
import { getAmount, getDuration } from '../redux/procedureDataSlice'
import {
  getCompletedDocumentsCount,
  getDocumentsTotal,
  getFiles
} from '../redux/documentsDataSlice'

export const mapStateToProps = state => ({
  documentsCompleted: getCompletedDocumentsCount(state),
  documentsTotal: getDocumentsTotal(state),
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

export default connectWithProcedures(mapStateToProps)(Overview)
