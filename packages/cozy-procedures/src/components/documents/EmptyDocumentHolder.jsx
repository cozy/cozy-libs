import React, { Component } from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import flow from 'lodash/flow'

import { withClient } from 'cozy-client'
import { withBreakpoints } from 'cozy-ui/transpiled/react/'

import { creditApplicationTemplate } from 'cozy-procedures'

import DocumentsDataFormContainer from '../../containers/DocumentsDataForm'

import MenuUploadMobile from './menuUpload/MenuUploadMobile'
import MenuUploadWeb from './menuUpload/MenuUploadWeb'
class EmptyDocumentHolder extends Component {
  state = {
    menuDisplayed: false
  }

  async onChange(file) {
    const { documentId, client, linkDocumentSuccess } = this.props
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
          datetime: file.lastModifiedDate
            ? file.lastModifiedDate.toISOString()
            : new Date().toISOString()
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
  documentId: PropTypes.string.isRequired,
  linkDocumentSuccess: PropTypes.func.isRequired,
  breakpoints: PropTypes.object.isRequired
}

export default flow(
  withBreakpoints(),
  withClient
)(DocumentsDataFormContainer(EmptyDocumentHolder))
