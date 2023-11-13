import React from 'react'

import Icon from 'cozy-ui/transpiled/react/Icon'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'
import { makeStyles } from 'cozy-ui/transpiled/react/styles'

const useStyles = makeStyles(() => ({
  typography: {
    color: 'var(--successColor)',
    marginLeft: '0.5rem'
  }
}))

const ScanResultTitle = () => {
  const styles = useStyles()
  const { t } = useI18n()

  return (
    <div className="u-flex u-flex-items-center u-flex-justify-center u-mb-1-half">
      <Icon
        icon="check-circle"
        color="var(--successColor)"
        aria-hidden="true"
      />
      <Typography variant="h4" className={styles.typography} role="status">
        {t('Acquisition.success')}
      </Typography>
    </div>
  )
}

export default ScanResultTitle
