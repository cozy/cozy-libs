import Procedure from '../Procedure'
import connectWithProcedures from '../redux/connectWithProcedures'
import {
  init as initDocuments,
  fetchDocumentsByCategory
} from '../redux/documentsDataSlice'
import {
  init as initPersonalData,
  fetchMyself,
  fetchBankAccountsStats
} from '../redux/personalDataSlice'
import {
  getInitialized,
  initializationSuccess
} from '../redux/procedureDataSlice'
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
