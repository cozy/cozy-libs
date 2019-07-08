import { connect } from 'react-redux'
import context from '../redux/context'
import {
  fetchDocumentsByCategory,
  getFiles,
  unlinkDocument,
  linkDocumentSuccess,
  getFilesStatus,
  fetchDocumentLoading,
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
  fetchDocumentLoading,
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
