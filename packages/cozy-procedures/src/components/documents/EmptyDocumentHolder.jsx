import React, { Component } from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import flow from 'lodash/flow'

import { withClient } from 'cozy-client'
import { withBreakpoints, Alerter, translate } from 'cozy-ui/transpiled/react/'

import { creditApplicationTemplate } from 'cozy-procedures'

import DocumentsDataFormContainer from '../../containers/DocumentsDataForm'

import MenuUploadMobile from './menuUpload/MenuUploadMobile'
import MenuUploadWeb from './menuUpload/MenuUploadWeb'
class EmptyDocumentHolder extends Component {
  state = {
    menuDisplayed: false
  }

  async onChange(file) {
    const {
      categoryId,
      client,
      linkDocumentSuccess,
      t,
      index,
      setDocumentLoading,
      fetchDocumentError
    } = this.props
    setDocumentLoading({ idDoctemplate: categoryId, index })
    const dirPath = creditApplicationTemplate.pathToSave
    const filesCollection = client.collection('io.cozy.files')
    const classification = get(
      creditApplicationTemplate.documents[categoryId],
      `rules.metadata.classification`
    )
    try {
      let metadata = {}
      if (classification) {
        metadata = {
          classification,
          datetime: new Date().toISOString()
        }
      }
      const dirId = await filesCollection.ensureDirectoryExists(dirPath)

      const createdFile = await client
        .collection('io.cozy.files')
        .createFile(file, { dirId, metadata })

      linkDocumentSuccess({ document: createdFile.data, categoryId, index })
    } catch (uploadError) {
      fetchDocumentError({
        idDoctemplate: categoryId,
        index,
        error: uploadError.message
      })
      if (uploadError.status === 409) {
        Alerter.error(t('documents.upload.conflict_error'))
      } else {
        Alerter.error(t('documents.upload.error'))
      }
    }
  }

  render() {
    const { breakpoints } = this.props

    const { isMobile } = breakpoints
    if (isMobile) {
      return <MenuUploadMobile onChange={this.onChange.bind(this)} />
    }
    return <MenuUploadWeb onChange={this.onChange.bind(this)} />
  }
}

EmptyDocumentHolder.propTypes = {
  categoryId: PropTypes.string.isRequired,
  linkDocumentSuccess: PropTypes.func.isRequired,
  breakpoints: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  setDocumentLoading: PropTypes.func.isRequired,
  fetchDocumentError: PropTypes.func.isRequired
}

export default flow(
  withBreakpoints(),
  withClient,
  translate()
)(DocumentsDataFormContainer(EmptyDocumentHolder))
