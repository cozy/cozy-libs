import React, { Component } from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import flow from 'lodash/flow'

import { withClient } from 'cozy-client'
import {
  translate,
  ButtonLink,
  Icon,
  FileInput,
  withBreakpoints,
  ActionMenu,
  Button,
  Title,
  Caption
} from 'cozy-ui/transpiled/react/'

import {
  ActionMenuItem,
  ActionMenuHeader
} from 'cozy-ui/transpiled/react/ActionMenu'
import { creditApplicationTemplate } from 'cozy-procedures'
import { isAndroidApp } from 'cozy-device-helper'
import UploadInputLabel from './UploadInputLabel'
import DocumentsDataFormContainer from '../../containers/DocumentsDataForm'
class EmptyDocumentHolder extends Component {
  state = {
    menuDisplayed: false
  }

  showMenu() {
    this.setState({ menuDisplayed: true })
  }
  hideMenu() {
    this.setState({ menuDisplayed: false })
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
  }

  render() {
    const { t, breakpoints } = this.props

    const { isMobile } = breakpoints

    if (isMobile) {
      return (
        <>
          <Button
            theme="ghost"
            extension="full"
            align="left"
            onClick={() => this.showMenu()}
          >
            <Icon icon="plus" size={16} className="u-mr-1 u-pa-half" />
            <span>{t('documents.import')}</span>
          </Button>
          {this.state.menuDisplayed && (
            <ActionMenu onClose={() => this.hideMenu()}>
              <ActionMenuHeader>
                <Title>{t('documents.import')}</Title>
              </ActionMenuHeader>
              <ActionMenuItem left={<Icon icon="file" />}>
                <p>
                  <span>{t('documents.upload.from_other_service')}</span>
                  <Caption>{t('documents.upload.soon_available')}</Caption>
                </p>
              </ActionMenuItem>
              <ActionMenuItem left={<Icon icon="forward" />}>
                <p>
                  <span>{t('documents.upload.from_drive')}</span>
                  <Caption>{t('documents.upload.soon_available')}</Caption>
                </p>
              </ActionMenuItem>
              <ActionMenuItem left={<Icon icon="file" />}>
                <FileInput onChange={this.onChange} hidden={true}>
                  <UploadInputLabel />
                </FileInput>
              </ActionMenuItem>

              {isAndroidApp() && (
                <ActionMenuItem left={<Icon icon="forward" />}>
                  <p>
                    <span> {t('documents.upload.from_my_mobile')}</span>
                    <Caption>{t('documents.upload.soon_available')}</Caption>
                  </p>
                </ActionMenuItem>
              )}
            </ActionMenu>
          )}
        </>
      )
    }
    return (
      <FileInput onChange={this.onChange} hidden={true}>
        <ButtonLink theme="ghost" extension="full" align="left">
          <Icon icon="plus" size={16} className="u-mr-1 u-pa-half" />
          <span>{t('documents.import')}</span>
        </ButtonLink>
      </FileInput>
    )
  }
}

EmptyDocumentHolder.propTypes = {
  t: PropTypes.func.isRequired,
  documentId: PropTypes.string.isRequired,
  linkDocumentSuccess: PropTypes.func.isRequired
}

export default flow(
  translate(),
  withBreakpoints(),
  withClient
)(DocumentsDataFormContainer(EmptyDocumentHolder))
