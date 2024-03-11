import PropTypes from 'prop-types'
import React, { Component } from 'react'

import {
  translate,
  Menu,
  MenuItem,
  Button,
  Icon,
  Caption,
  FileInput
} from 'cozy-ui/transpiled/react'
import FileIcon from 'cozy-ui/transpiled/react/Icons/File'
import PlusIcon from 'cozy-ui/transpiled/react/Icons/Plus'

import UploadInputLabel from '../UploadInputLabel'

class MenuUploadWeb extends Component {
  render() {
    const { t, onChange } = this.props
    return (
      <Menu
        component={
          <Button
            theme="ghost"
            extension="full"
            align="left"
            label={t('documents.import')}
            iconOnly
          >
            <Icon icon={PlusIcon} size={16} className="u-mr-1 u-pa-half" />
            <span>{t('documents.import')}</span>
          </Button>
        }
        className="u-db"
        position="right"
        /**
         * We need to specifiy an onSelect props that return false in order
         * to not close the menu when the user clicks on a MenuItem.
         *
         */
        onSelect={() => false}
      >
        <MenuItem icon={<Icon icon={FileIcon} />} disabled>
          <span>{t('documents.upload.from_other_service')}</span>
          <Caption>{t('documents.upload.soon_available')}</Caption>
        </MenuItem>
        <MenuItem icon={<Icon icon={FileIcon} />} disabled>
          <span>{t('documents.upload.from_drive')}</span>
          <Caption>{t('documents.upload.soon_available')}</Caption>
        </MenuItem>
        <MenuItem icon={<Icon icon={FileIcon} />}>
          <FileInput onChange={file => onChange(file)} hidden={true}>
            <UploadInputLabel />
          </FileInput>
        </MenuItem>
      </Menu>
    )
  }
}

MenuUploadWeb.propTypes = {
  t: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired
}
export default translate()(MenuUploadWeb)
