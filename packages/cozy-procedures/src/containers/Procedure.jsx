import { connect } from 'react-redux'

import Context from '../redux/context'
import {
  init as initPersonalData,
  fetchMyself
} from '../redux/personalDataSlice'
import Procedure from '../Procedure'
import withLocales from '../withLocales'

const mapDispatchToProps = {
  initPersonalData,
  fetchMyself
}

export default withLocales(
  connect(
    null,
    mapDispatchToProps,
    null,
    { context: Context }
  )(Procedure)
)
