import connectWithProcedures from '../redux/connectWithProcedures'
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
  connectWithProcedures(mapStateToProps, mapDispatchToProps)(Procedure)
)
