import { connect } from 'react-redux'
import context from '../redux/context'
import {
  fetchDocument,
  getFiles,
  unlinkDocument,
  linkDocumentSuccess
} from '../redux/documentsDataSlice'

const mapStateToProps = state => ({
  files: getFiles(state)
})

const mapDispatchToProps = {
  fetchDocument,
  unlinkDocument,
  linkDocumentSuccess
}

const DocumentsDataFormContainer = Component =>
  connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    { context }
  )(Component)

export default DocumentsDataFormContainer
