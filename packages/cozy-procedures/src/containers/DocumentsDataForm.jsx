import { connect } from 'react-redux'
import context from '../redux/context'
import {
  fetchDocument,
  getDocuments,
  unlinkDocument
} from '../redux/documentsDataSlice'

const mapStateToProps = state => ({
  data: getDocuments(state)
})

const mapDispatchToProps = {
  fetchDocument,
  unlinkDocument
}

const DocumentsDataFormContainer = Component =>
  connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    { context }
  )(Component)

export default DocumentsDataFormContainer
