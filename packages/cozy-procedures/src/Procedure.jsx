import React from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import { withClient, Query } from 'cozy-client'
import { Document } from 'cozy-doctypes'
import { creditApplicationTemplate } from 'cozy-procedures'
import { Spinner, Alerter } from 'cozy-ui/transpiled/react/'

const DOCTYPE_CONTACTS = 'io.cozy.contacts'

class Procedure extends React.Component {
  componentDidMount() {
    const {
      initPersonalData,
      initDocuments,
      fetchDocumentsByCategory,
      client,
      setProcedureStatus,
      fetchBankAccountsStats
    } = this.props
    //We init our Document model here to be able to use CozyFile or AdministrativeProcedure models where we want
    if (!Document.cozyClient) {
      Document.registerClient(client)
    }
    initPersonalData(
      get(creditApplicationTemplate, 'personalData.schema.properties', {})
    )

    initDocuments(get(creditApplicationTemplate, 'documents'))
    //Since init is done, we tell the app we can start to render thing
    setProcedureStatus({ initiated: true })

    fetchBankAccountsStats(client)

    const { documents: documentsCategory } = creditApplicationTemplate
    Object.keys(documentsCategory).map(document => {
      fetchDocumentsByCategory(document)
    })
  }

  render() {
    const { fetchMyselfSuccess, initiated, children } = this.props
    return (
      <div className="u-ph-1 u-pv-2 u-maw-6" data-procedure>
        {initiated === true ? (
          <Query
            query={client => client.find(DOCTYPE_CONTACTS).where({ me: true })}
          >
            {({ data, fetchStatus: fetchMyselfStatus }) => {
              if (fetchMyselfStatus === 'loaded' && data && data.length === 1) {
                fetchMyselfSuccess(data[0])
              }
              return children
            }}
          </Query>
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
  setProcedureStatus: PropTypes.func.isRequired,
  initiated: PropTypes.bool.isRequired,
  client: PropTypes.object.isRequired,
  fetchBankAccountsStats: PropTypes.func.isRequired
}
export default withClient(Procedure)
