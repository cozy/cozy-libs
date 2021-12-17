import connectWithProcedures from '../redux/connectWithProcedures'
import Duration from '../components/Duration'
import {
  getAmount,
  getDuration,
  updateDuration
} from '../redux/procedureDataSlice'

const mapStateToProps = state => ({
  duration: getDuration(state),
  amount: getAmount(state)
})

const mapDispatchToProps = {
  updateDuration
}

export default connectWithProcedures(mapStateToProps, mapDispatchToProps)(
  Duration
)
