import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import { Title, translate, Label, Button } from 'cozy-ui/transpiled/react/'

import Topbar from './Topbar'
import EmptyDocumentHolder from './documents/EmptyDocumentHolder'
import LoadingDocumentHolder from './documents/LoadingDocumentHolder'
import DocumentsGroup from './documents/DocumentsGroup'
import DocumentHolder from './documents/DocumentHolder'
import { creditApplicationTemplate } from 'cozy-procedures'
import DocumentsContainer from '../containers/DocumentsDataForm'

/**
 * This function is used to populate an array based on the order
 * from the documentsTemplate and set the linked document from the store
 * @param {Object} docsFromStore
 * @param {Object} documentsTemplate
 */
export const mergeDocsFromStoreAndTemplate = (
  docsFromStore,
  documentsTemplate
) => {
  let sorted = {}
  Object.keys(documentsTemplate)
    .sort(function(a, b) {
      return documentsTemplate[a].order - documentsTemplate[b].order
    })
    .forEach(key => {
      sorted[key] = documentsTemplate[key]
      if (docsFromStore[key] && docsFromStore[key].documents) {
        sorted[key].documents = docsFromStore[key].documents
      }
    })

  return sorted
}
class Documents extends React.Component {
  render() {
    const { t, router, data: docsFromStore } = this.props
    const { documents: documentsTemplate } = creditApplicationTemplate
    const populatedTemplateDocsWithStore = mergeDocsFromStoreAndTemplate(
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
        {Object.values(populatedTemplateDocsWithStore).map(
          (documentTemplate, index) => {
            const { documents: documentsFromStore } = documentTemplate
            return (
              <section key={index}>
                <Label>{t(`documents.labels.${documentTemplate.label}`)}</Label>
                <DocumentsGroup
                  documents={documentsFromStore}
                  templateDoc={documentTemplate}
                />
              </section>
            )
          }
        )}
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
  }).isRequired,
  data: PropTypes.object
}

export default withRouter(translate()(DocumentsContainer(Documents)))
