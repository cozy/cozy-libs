import { connect } from 'react-redux'
import context from '../redux/context'
import { fetchDocument, getDocuments } from '../redux/documentsDataSlice'

const mapStateToProps = state => ({
  data: getDocuments(state)
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
