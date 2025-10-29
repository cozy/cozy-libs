import PersonalDataForm from '../components/PersonalDataForm'
import connectWithProcedures from '../redux/connectWithProcedures'
import { getData, update } from '../redux/personalDataSlice'

const mapStateToProps = state => ({
  formData: getData(state)
})

const mapDispatchToProps = dispatch => ({
  updateFormData: value => dispatch(update(value))
})

export default connectWithProcedures(
  mapStateToProps,
  mapDispatchToProps
)(PersonalDataForm)
