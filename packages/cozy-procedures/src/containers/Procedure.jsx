import { connect } from 'react-redux'

import Context from '../redux/context'
import {
  init as initPersonalData,
  fetchMyself
} from '../redux/personalDataSlice'
import { init as initDocuments } from '../redux/documentsDataSlice'
import { fetchDocument } from '../redux/documentsDataSlice'

import Procedure from '../Procedure'
import withLocales from '../withLocales'

const mapDispatchToProps = {
  initPersonalData,
  fetchMyself,
  initDocuments,
  fetchDocument
}

export default withLocales(
  connect(
    null,
    mapDispatchToProps,
    null,
    { context: Context }
  )(Procedure)
)
