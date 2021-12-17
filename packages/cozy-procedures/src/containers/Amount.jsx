import connectWithProcedures from '../redux/connectWithProcedures'
import Amount from '../components/Amount'
import { getAmount, updateAmount } from '../redux/procedureDataSlice'

const mapStateToProps = state => ({
  amount: getAmount(state)
})

const mapDispatchToProps = {
  updateAmount
}

export default connectWithProcedures(mapStateToProps, mapDispatchToProps)(
  Amount
)
