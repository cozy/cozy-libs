import { connect } from 'react-redux'
import context from '../redux/context'
import DocumentsDataForm from '../components/Documents'
import { fetchDocument } from '../redux/documentsDataSlice'

const mapStateToProps = state => ({
  //formData: getSlice(state)
})

const mapDispatchToProps = {
  fetchDocument
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { context }
)(DocumentsDataForm)
