import { connect } from 'react-redux'
import context from '../redux/context'
import PersonalDataForm from '../components/PersonalDataForm'
import { getData, update } from '../redux/personalDataSlice'

const mapStateToProps = state => ({
  formData: getData(state)
})

const mapDispatchToProps = dispatch => ({
  updateFormData: value => dispatch(update(value))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { context }
)(PersonalDataForm)
