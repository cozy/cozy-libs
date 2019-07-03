import connectWithProcedures from '../redux/connectWithProcedures'
import Amount from '../components/Amount'
import { getSlice, update } from '../redux/amountSlice'

const mapStateToProps = state => ({
  amount: getSlice(state)
})

const mapDispatchToProps = dispatch => ({
  updateAmount: value => dispatch(update(value))
})

export default connectWithProcedures(mapStateToProps, mapDispatchToProps)(
  Amount
)
