import connectWithProcedures from '../redux/connectWithProcedures'
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
  connectWithProcedures(mapStateToProps, mapDispatchToProps)(Component)

export default DocumentsDataFormContainer
