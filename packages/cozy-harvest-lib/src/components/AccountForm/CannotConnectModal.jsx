import PropTypes from 'prop-types'
import React from 'react'
import { useI18n } from 'twake-i18n'

import { ConfirmDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import Typography from 'cozy-ui/transpiled/react/Typography'

import Markdown from '../Markdown'
import { useComponentsProps } from '../Providers/ComponentsPropsProvider'

const CannotConnectModal = ({ vendorName, vendorLink, onClose }) => {
  const { t } = useI18n()
  const { ComponentsProps } = useComponentsProps()

  return (
    <ConfirmDialog
      open
      content={
        <>
          <Typography variant="h4" className="u-mb-1">
            {t('accountForm.cannotConnectModal.title')}
          </Typography>
          <Markdown
            className="u-mb-1"
            source={t('accountForm.cannotConnectModal.content', {
              vendorLink,
              vendorName
            })}
          />
          <Markdown
            className="u-mb-1"
            source={t('accountForm.cannotConnectModal.noAccount', {
              vendorLink,
              vendorName
            })}
          />
          {ComponentsProps?.CannotConnectModal?.extraContent}
        </>
      }
      onClose={onClose}
    />
  )
}

CannotConnectModal.propTypes = {
  vendorName: PropTypes.string,
  vendorLink: PropTypes.string,
  onClose: PropTypes.func
}

export default CannotConnectModal
