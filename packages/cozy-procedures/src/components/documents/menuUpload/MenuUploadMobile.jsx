import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {
  translate,
  Icon,
  FileInput,
  ActionMenu,
  Button,
  Title,
  Caption,
  MenuItem
} from 'cozy-ui/transpiled/react/'

import { ActionMenuHeader } from 'cozy-ui/transpiled/react/ActionMenu'
import { isAndroidApp } from 'cozy-device-helper'
import UploadInputLabel from '../UploadInputLabel'

class MenuUploadMobile extends Component {
  state = {
    menuDisplayed: false
  }

  showMenu() {
    this.setState({ menuDisplayed: true })
  }
  hideMenu() {
    this.setState({ menuDisplayed: false })
  }

  render() {
    const { t, onChange } = this.props
    return (
      <>
        <Button
          theme="ghost"
          extension="full"
          align="left"
          onClick={() => this.showMenu()}
          label={t('documents.import')}
          iconOnly
        >
          <Icon icon="plus" size={16} className="u-mr-1 u-pa-half" />
          <span>{t('documents.import')}</span>
        </Button>
        {this.state.menuDisplayed && (
          <ActionMenu onClose={() => this.hideMenu()}>
            <ActionMenuHeader>
              <Title>{t('documents.import')}</Title>
            </ActionMenuHeader>

            <MenuItem
              icon={<Icon icon="file" />}
              onClick={e => e.stopPropagation()}
              disabled
            >
              <span>{t('documents.upload.from_other_service')}</span>
              <Caption>{t('documents.upload.soon_available')}</Caption>
            </MenuItem>
            <MenuItem
              icon={<Icon icon="file" />}
              disabled
              onClick={e => e.stopPropagation()}
            >
              <span>{t('documents.upload.from_drive')}</span>
              <Caption>{t('documents.upload.soon_available')}</Caption>
            </MenuItem>
            <MenuItem
              icon={<Icon icon="file" />}
              /**
               * We need to stop the propagation since when we click on an Item, MenuItem closes the Menu
               *
               * With a stopPropgration the native file input works, and we can select a file.
               * We don't need to handle the close menu action because if the upload works correctly, this
               * EmptyDocumentHolder component is unmounted
               */
              onClick={e => e.stopPropagation()}
            >
              <FileInput onChange={file => onChange(file)} hidden={true}>
                <UploadInputLabel />
              </FileInput>
            </MenuItem>

            {isAndroidApp() && (
              <MenuItem
                icon={<Icon icon="file" />}
                onClick={e => e.stopPropagation()}
                disabled
              >
                <span> {t('documents.upload.scan_a_doc')}</span>
                <Caption>{t('documents.upload.soon_available')}</Caption>
              </MenuItem>
            )}
          </ActionMenu>
        )}
      </>
    )
  }
}

MenuUploadMobile.propTypes = {
  t: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired
}

export default translate()(MenuUploadMobile)
