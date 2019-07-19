import CompletedFromDriveStatus from '../components/CompletedFromDriveStatus'
import connectWithProcedures from '../redux/connectWithProcedures'
import {
  getCompletedFromDrive,
  getDocumentsTotal
} from '../redux/documentsDataSlice'

export const mapStateToProps = state => ({
  completed: getCompletedFromDrive(state),
  total: getDocumentsTotal(state)
})

export default connectWithProcedures(mapStateToProps)(CompletedFromDriveStatus)
