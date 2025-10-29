import flow from 'lodash/flow'
import get from 'lodash/get'
import PropTypes from 'prop-types'
import React, { Component } from 'react'

import { CozyFile } from 'cozy-doctypes'
import { creditApplicationTemplate } from 'cozy-procedures'
import { withBreakpoints, Alerter, translate } from 'cozy-ui/transpiled/react/'

import MenuUploadMobile from './menuUpload/MenuUploadMobile'
import MenuUploadWeb from './menuUpload/MenuUploadWeb'
import DocumentsDataFormContainer from '../../containers/DocumentsDataForm'
class EmptyDocumentHolder extends Component {
  state = {
    menuDisplayed: false
  }

  async onChange(file) {
    const {
      categoryId,
      linkDocumentSuccess,
      t,
      index,
      setDocumentLoading,
      fetchDocumentError,
      setLoadingFalse
    } = this.props
    setDocumentLoading({ idDoctemplate: categoryId, index })
    const dirPath = creditApplicationTemplate.pathToSave
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
      const createdFile = await CozyFile.overrideFileForPath(
        dirPath,
        file,
        metadata
      )
      linkDocumentSuccess({ document: createdFile.data, categoryId, index })
    } catch (uploadError) {
      fetchDocumentError({
        idDoctemplate: categoryId,
        index,
        error: uploadError.message
      })

      Alerter.error(t('documents.upload.error'))
    } finally {
      setLoadingFalse({ idDoctemplate: categoryId, index })
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
  setLoadingFalse: PropTypes.func.isRequired,
  breakpoints: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  setDocumentLoading: PropTypes.func.isRequired,
  fetchDocumentError: PropTypes.func.isRequired
}

export default flow(
  withBreakpoints(),
  translate()
)(DocumentsDataFormContainer(EmptyDocumentHolder))
