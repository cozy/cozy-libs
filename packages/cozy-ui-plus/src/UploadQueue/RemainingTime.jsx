import cx from 'classnames'
import React from 'react'

import Typography from 'cozy-ui/transpiled/react/Typography'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { numberOfReferencesForPluralForm } from './helpers'
import { formatRemainingTime } from './index'
import styles from './styles.styl'

const RemainingTime = ({ durationInSec }) => {
  const { t } = useI18n()

  return (
    <Typography
      variant="caption"
      className={cx(styles['upload-queue__progress-caption'], 'u-ellipsis')}
    >
      {t('item.remainingTime', {
        time: formatRemainingTime(durationInSec),
        smart_count: numberOfReferencesForPluralForm(durationInSec)
      })}
    </Typography>
  )
}

export default RemainingTime
