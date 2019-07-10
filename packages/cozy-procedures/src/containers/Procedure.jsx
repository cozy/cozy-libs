import { connect } from 'react-redux'

import Context from '../redux/context'
import {
  init as initPersonalData,
  fetchMyself,
  fetchBankAccountsStats
} from '../redux/personalDataSlice'
import {
  init as initDocuments,
  fetchDocumentsByCategory,
  setProcedureStatus,
  getInitiated
} from '../redux/documentsDataSlice'

import Procedure from '../Procedure'
import withLocales from '../withLocales'

const mapStateToProps = state => ({
  initiated: getInitiated(state)
})
const mapDispatchToProps = {
  initPersonalData,
  fetchMyself,
  initDocuments,
  fetchDocumentsByCategory,
  setProcedureStatus,
  fetchBankAccountsStats
}

export default withLocales(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    { context: Context }
  )(Procedure)
)
