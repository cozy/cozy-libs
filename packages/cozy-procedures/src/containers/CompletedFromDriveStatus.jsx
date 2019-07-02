import { connect } from 'react-redux'

import context from '../redux/context'
import CompletedFromDriveStatus from '../components/CompletedFromDriveStatus'
import {
  getCompletedFromDrive,
  getDocumentsTotal
} from '../redux/documentsDataSlice'

export const mapStateToProps = state => ({
  completed: getCompletedFromDrive(state),
  total: getDocumentsTotal(state)
})

export default connect(
  mapStateToProps,
  null,
  null,
  { context }
)(CompletedFromDriveStatus)
