import { connect } from 'react-redux'
import context from '../redux/context'
import { fetchDocument, getFiles } from '../redux/documentsDataSlice'

const mapStateToProps = state => ({
  files: getFiles(state)
})

const mapDispatchToProps = {
  fetchDocument
}

const DocumentsDataFormContainer = Component =>
  connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    { context }
  )(Component)

export default DocumentsDataFormContainer
