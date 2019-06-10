import { connect } from 'react-redux'
import context from '../redux/context'
import PersonalDataForm from '../components/PersonalDataForm'
import { getSlice, update as updateFormData } from '../redux/personalDataSlice'

const mapStateToProps = state => ({
  formData: getSlice(state)
})

const mapDispatchToProps = dispatch => ({
  updateFormData: value => dispatch(updateFormData(value))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { context }
)(PersonalDataForm)
