import { connect } from 'react-redux'
import context from '../redux/context'
import Amount from '../components/Amount'
import { getSlice, update } from '../redux/amountSlice'

const mapStateToProps = state => ({
  amount: getSlice(state)
})

const mapDispatchToProps = dispatch => ({
  updateAmount: value => dispatch(update(value))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { context }
)(Amount)
