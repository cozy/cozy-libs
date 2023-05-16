/* global cozy */
import React, { useState } from 'react'

import Button from 'cozy-ui/transpiled/react/Buttons'
import { ConfirmDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Icon from 'cozy-ui/transpiled/react/Icon'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import Typography from 'cozy-ui/transpiled/react/Typography'

const url = 'https://support.grandlyon.com/mes-papiers/'

const Help = () => {
  const [showDialog, setShowDialog] = useState(false)
  const { t } = useI18n()
  const { BarRight } = cozy.bar

  return (
    <>
      <BarRight>
        <IconButton onClick={() => setShowDialog(true)}>
          <Icon icon="help" />
        </IconButton>
      </BarRight>
      {showDialog && (
        <ConfirmDialog
          open
          title={t('Home.Help.title')}
          content={
            <>
              <Typography
                dangerouslySetInnerHTML={{
                  __html: t('Home.Help.content.paragraph01')
                }}
              />
              <Typography className="u-mt-1">
                {t('Home.Help.content.paragraph02')}
              </Typography>
              <Typography
                className="u-mt-1"
                dangerouslySetInnerHTML={{
                  __html: t('Home.Help.content.paragraph03', { url })
                }}
              />
              <Typography className="u-mt-1">
                {t('Home.Help.content.paragraph04')}
              </Typography>
            </>
          }
          actions={
            <>
              <Button
                fullWidth
                variant="secondary"
                label={t('Home.Help.actions.later')}
                onClick={() => setShowDialog(false)}
              />
              <Button
                component="a"
                href={url}
                target="_blank"
                rel="noopener"
                fullWidth
                label={t('Home.Help.actions.go')}
                endIcon={<Icon icon="link-out" />}
              />
            </>
          }
          onClose={() => setShowDialog(false)}
        />
      )}
    </>
  )
}

export default Help
