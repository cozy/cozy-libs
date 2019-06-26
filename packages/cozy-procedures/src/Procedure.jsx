import React from 'react'
import get from 'lodash/get'
import { withClient } from 'cozy-client'
import { Document } from 'cozy-doctypes'
import { creditApplicationTemplate } from 'cozy-procedures'
import { Spinner } from 'cozy-ui/transpiled/react/'

class Procedure extends React.Component {
  componentDidMount() {
    const {
      initPersonalData,
      initDocuments,
      fetchMyself,
      fetchDocument,
      client,
      setStatusDemarche
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
    setStatusDemarche({ initiated: true })
    fetchMyself(client)

    const { documents: documentsTemplate } = creditApplicationTemplate
    Object.keys(documentsTemplate).map(document => {
      fetchDocument(client, document)
    })
  }

  render() {
    return (
      <div className="u-p-1 u-maw-6">
        {this.props.initiated === true ? (
          this.props.children
        ) : (
          <Spinner size="xxlarge" />
        )}
      </div>
    )
  }
}

export default withClient(Procedure)
