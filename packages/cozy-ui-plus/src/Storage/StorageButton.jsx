import cx from 'classnames'
import React from 'react'

import { useInstanceInfo } from 'cozy-client'
import { buildPremiumLink } from 'cozy-client/dist/models/instance'
import Button from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'
import TwakeWorkplaceIcon from 'cozy-ui/transpiled/react/Icons/TwakeWorkplace'
import { useI18n, useExtendI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { locales } from './locales'

const StorageButton = ({ className }) => {
  useExtendI18n(locales)
  const { t } = useI18n()
  const instanceInfo = useInstanceInfo()

  return (
    <Button
      className={cx('u-bdrs-4', className)}
      variant="secondary"
      label={t('Storage.increase')}
      startIcon={<Icon icon={TwakeWorkplaceIcon} size={22} />}
      size="small"
      height="auto"
      fullWidth
      component="a"
      target="_blank"
      href={buildPremiumLink(instanceInfo)}
    />
  )
}

export default StorageButton
