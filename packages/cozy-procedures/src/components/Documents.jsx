import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import { Title, translate, Label, Button } from 'cozy-ui/transpiled/react/'
import { AdministrativeProcedure } from 'cozy-doctypes'

import Topbar from './Topbar'
import EmptyDocumentHolder from './documents/EmptyDocumentHolder'
import LoadingDocumentHolder from './documents/LoadingDocumentHolder'
import DocumentsGroups from './documents/DocumentsGroups'
import DocumentHolder from './documents/DocumentHolder'
import { creditApplicationTemplate } from 'cozy-procedures'
import DocumentsContainer from '../containers/DocumentsDataForm'

class Documents extends React.Component {
  render() {
    const { t, router, data: docsFromStore } = this.props
    const { documents: documentsTemplate } = creditApplicationTemplate
    const mergedDocuments = AdministrativeProcedure.mergeDocsFromStoreAndTemplate(
      docsFromStore,
      documentsTemplate
    )

    return (
      <div>
        <Topbar title={t('documents.title')} />
        <Title>{t('documents.subtitle')}</Title>
        <div>
          <Label>Demo, to remove</Label>
          <EmptyDocumentHolder />
          <LoadingDocumentHolder />
          <DocumentHolder />
        </div>
        {Object.values(mergedDocuments).map((document, index) => {
          return (
            <section key={index}>
              <Label>{t(`documents.labels.${document.label}`)}</Label>
              <DocumentsGroups
                documents={document.documents}
                templateDoc={document}
              />
            </section>
          )
        })}
        <div>
          <Button
            label={t('confirm')}
            extension="full"
            onClick={router.goBack}
          />
        </div>
      </div>
    )
  }
}

Documents.propTypes = {
  t: PropTypes.func.isRequired,
  router: PropTypes.shape({
    goBack: PropTypes.func.isRequired
  }).isRequired
}

export default withRouter(translate()(DocumentsContainer(Documents)))
