import { connect } from 'react-redux'
import context from '../redux/context'
import Overview from '../components/Overview'
import { getSlice } from '../redux/personalDataSlice'

const mapStateToProps = state => ({
  personalData: getSlice(state) || {}
})

export default connect(
  mapStateToProps,
  null,
  null,
  { context }
)(Overview)
