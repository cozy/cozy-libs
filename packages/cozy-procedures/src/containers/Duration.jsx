import connectWithProcedures from '../redux/connectWithProcedures'
import Duration from '../components/Duration'
import { getSlice as getDuration, update } from '../redux/durationSlice'
import { getSlice as getAmount } from '../redux/amountSlice'

const mapStateToProps = state => ({
  duration: getDuration(state),
  amount: getAmount(state)
})

const mapDispatchToProps = dispatch => ({
  updateDuration: value => dispatch(update(value))
})

export default connectWithProcedures(mapStateToProps, mapDispatchToProps)(
  Duration
)
