import connectWithProcedures from '../redux/connectWithProcedures'
import {
  getInitialized,
  initializationSuccess
} from '../redux/procedureDataSlice'
import {
  init as initPersonalData,
  fetchMyself,
  fetchBankAccountsStats
} from '../redux/personalDataSlice'
import {
  init as initDocuments,
  fetchDocumentsByCategory
} from '../redux/documentsDataSlice'

import Procedure from '../Procedure'
import withLocales from '../withLocales'

const mapStateToProps = state => ({
  initialized: getInitialized(state)
})

const mapDispatchToProps = {
  initPersonalData,
  fetchMyself,
  initDocuments,
  fetchDocumentsByCategory,
  fetchBankAccountsStats,
  initializationSuccess
}

export default withLocales(
  connectWithProcedures(mapStateToProps, mapDispatchToProps)(Procedure)
)
