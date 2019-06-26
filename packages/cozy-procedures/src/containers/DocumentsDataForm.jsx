import { connect } from 'react-redux'
import context from '../redux/context'
import DocumentsDataForm from '../components/Documents'
import { fetchDocument } from '../redux/documentsDataSlice'

//const mapStateToProps = {}

const mapDispatchToProps = {
  fetchDocument
}

export default connect(
  null,
  mapDispatchToProps,
  null,
  { context }
)(DocumentsDataForm)
