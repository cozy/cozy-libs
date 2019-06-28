import React from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'

import { withClient } from 'cozy-client'
import {
  translate,
  ButtonLink,
  Icon,
  FileInput
} from 'cozy-ui/transpiled/react/'

import { creditApplicationTemplate } from 'cozy-procedures'

import DocumentsDataFormContainer from '../../containers/DocumentsDataForm'
const EmptyDocumentHolder = ({
  t,
  documentId,
  client,
  linkDocumentSuccess
}) => (
  <FileInput
    onChange={async file => {
      const dirPath = creditApplicationTemplate.pathToSave
      const filesCollection = client.collection('io.cozy.files')

      const classification = get(
        creditApplicationTemplate.documents[documentId],
        `rules.metadata.classification`
      )
      try {
        let metadata = {}
        if (classification) {
          metadata = {
            classification,
            datetime: file.lastModifiedDate.toISOString()
          }
        }
        const dirId = await filesCollection.ensureDirectoryExists(dirPath)

        const createdFile = await client
          .collection('io.cozy.files')
          .createFile(file, { dirId, metadata })

        linkDocumentSuccess({ document: createdFile.data, documentId })
      } catch (uploadError) {
        console.log('errr', uploadError)
      }
    }}
    hidden={true}
  >
    <ButtonLink theme="ghost" extension="full" align="left">
      <Icon icon="plus" size={16} className="u-mr-1 u-pa-half" />
      <span>{t('documents.import')}</span>
    </ButtonLink>
  </FileInput>
)

EmptyDocumentHolder.propTypes = {
  t: PropTypes.func.isRequired,
  documentId: PropTypes.string.isRequired,
  linkDocumentSuccess: PropTypes.func.isRequired
}

export default translate()(
  withClient(DocumentsDataFormContainer(EmptyDocumentHolder))
)
