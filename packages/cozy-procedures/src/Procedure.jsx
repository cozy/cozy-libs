import get from 'lodash/get'
import PropTypes from 'prop-types'
import React from 'react'

import { withClient } from 'cozy-client'
import { Document } from 'cozy-doctypes'
import { creditApplicationTemplate } from 'cozy-procedures'
import { Spinner, Alerter } from 'cozy-ui/transpiled/react/'

class Procedure extends React.Component {
  componentDidMount() {
    const {
      initPersonalData,
      initDocuments,
      fetchMyself,
      fetchDocumentsByCategory,
      client,
      initializationSuccess,
      fetchBankAccountsStats
    } = this.props
    // We init our Document model here to be able to use CozyFile or AdministrativeProcedure models where we want
    if (!Document.cozyClient) {
      Document.registerClient(client)
    }
    initPersonalData(
      get(creditApplicationTemplate, 'personalData.schema.properties', {})
    )

    initDocuments(get(creditApplicationTemplate, 'documents'))
    // Since init is done, we tell the app we can start to render thing
    initializationSuccess()
    fetchMyself(client)

    fetchBankAccountsStats(client)

    const { documents: documentsCategory } = creditApplicationTemplate
    Object.keys(documentsCategory).map(document => {
      fetchDocumentsByCategory(client, document)
    })
  }

  render() {
    return (
      <div data-procedure>
        {this.props.initialized === true ? (
          this.props.children
        ) : (
          <Spinner size="xxlarge" />
        )}
        <Alerter />
      </div>
    )
  }
}

Procedure.propTypes = {
  initPersonalData: PropTypes.func.isRequired,
  initDocuments: PropTypes.func.isRequired,
  fetchMyself: PropTypes.func.isRequired,
  fetchDocumentsByCategory: PropTypes.func.isRequired,
  initializationSuccess: PropTypes.func.isRequired,
  initialized: PropTypes.bool.isRequired,
  client: PropTypes.object.isRequired,
  fetchBankAccountsStats: PropTypes.func.isRequired
}
export default withClient(Procedure)
