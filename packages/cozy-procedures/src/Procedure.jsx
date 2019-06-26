import React from 'react'
import get from 'lodash/get'
import { withClient } from 'cozy-client'
import { Document } from 'cozy-doctypes'
import creditApplicationTemplate from './templates/creditApplicationTemplate'
class Procedure extends React.Component {
  componentDidMount() {
    const {
      initPersonalData,
      initDocuments,
      fetchMyself,
      fetchDocument,
      client
    } = this.props
    if (!Document.cozyClient) {
      Document.registerClient(client)
    }
    initPersonalData(
      get(creditApplicationTemplate, 'personalData.schema.properties', {})
    )

    initDocuments(get(creditApplicationTemplate, 'documents'))
    fetchMyself(client)

    const { documents: documentsTemplate } = creditApplicationTemplate
    Object.keys(documentsTemplate).map(document => {
      fetchDocument(client, document)
    })
  }

  render() {
    return <div className="u-p-1 u-maw-6">{this.props.children}</div>
  }
}

export default withClient(Procedure)
