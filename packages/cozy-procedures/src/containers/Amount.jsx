import Amount from '../components/Amount'
import connectWithProcedures from '../redux/connectWithProcedures'
import { getAmount, updateAmount } from '../redux/procedureDataSlice'

const mapStateToProps = state => ({
  amount: getAmount(state)
})

const mapDispatchToProps = {
  updateAmount
}

export default connectWithProcedures(
  mapStateToProps,
  mapDispatchToProps
)(Amount)
