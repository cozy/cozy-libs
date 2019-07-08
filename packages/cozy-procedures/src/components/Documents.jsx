import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import { Title, translate, Label, Button } from 'cozy-ui/transpiled/react/'

import Topbar from './Topbar'
import DocumentsGroup from '../components/documents/DocumentsGroup'
import { creditApplicationTemplate } from 'cozy-procedures'
import DocumentsContainer from '../containers/DocumentsDataForm'
import CompletedFromDriveStatus from '../containers/CompletedFromDriveStatus'

/**
 * This function is used to populate an array based on the order
 * from the documentsTemplate and set the linked document from the store
 *
 * We need to sort the template in order to display it correctly. Once the
 * template is sorted, we populated it with the files coming from our store
 *
 * Since ES6, Object properties seems to be keeped :)
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
      if (docsFromStore[key] && docsFromStore[key].files) {
        sorted[key].files = docsFromStore[key].files
      }
    })

  return sorted
}
class Documents extends React.Component {
  render() {
    const { t, router, files: docsFromStore, filesStatus } = this.props
    const { documents: documentsTemplate } = creditApplicationTemplate
    const populatedTemplateDocsWithFiles = mergeDocsFromStoreAndTemplate(
      docsFromStore,
      documentsTemplate
    )

    return (
      <div>
        <Topbar title={t('documents.title')} />
        <Title className="u-ta-center u-mb-2">{t('documents.subtitle')}</Title>
        <CompletedFromDriveStatus />
        {Object.keys(populatedTemplateDocsWithFiles).map(
          (categoryId, index) => {
            const { files, count } = populatedTemplateDocsWithFiles[categoryId]
            const filesStatusByCategory = filesStatus[categoryId]
            return (
              <section key={index}>
                <Label>
                  {t(
                    `documents.labels.${
                      populatedTemplateDocsWithFiles[categoryId].label
                    }`
                  )}
                </Label>
                <DocumentsGroup
                  files={files}
                  filesStatusByCategory={filesStatusByCategory}
                  templateDocumentsCount={count}
                  categoryId={categoryId}
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
            className="u-mt-2 u-mb-1"
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
  files: PropTypes.object,
  filesStatus: PropTypes.object
}

export default withRouter(translate()(DocumentsContainer(Documents)))
