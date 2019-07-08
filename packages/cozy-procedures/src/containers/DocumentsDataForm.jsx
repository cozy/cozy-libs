import { connect } from 'react-redux'
import context from '../redux/context'
import {
  fetchDocumentsByCategory,
  getFiles,
  unlinkDocument,
  linkDocumentSuccess,
  getFilesStatus,
  setDocumentLoading,
  fetchDocumentError
} from '../redux/documentsDataSlice'

const mapStateToProps = state => ({
  files: getFiles(state),
  filesStatus: getFilesStatus(state)
})

const mapDispatchToProps = {
  fetchDocumentsByCategory,
  unlinkDocument,
  linkDocumentSuccess,
  setDocumentLoading,
  fetchDocumentError
}

const DocumentsDataFormContainer = Component =>
  connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    { context }
  )(Component)

export default DocumentsDataFormContainer
