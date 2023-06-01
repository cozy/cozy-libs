import PropTypes from 'prop-types'
import React from 'react'

import Box from 'cozy-ui/transpiled/react/Box'
import Button from 'cozy-ui/transpiled/react/Buttons'
import { Dialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import Empty from 'cozy-ui/transpiled/react/Empty'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import IlluCozyCloud from '../../../assets/icons/IlluCozyCloud.svg'
import { getLink } from '../helpers'

const InstallAppModal = ({ onBack }) => {
  const { t } = useI18n()
  const { url, name } = getLink()

  return (
    <Dialog
      open
      transitionDuration={0}
      onBack={onBack}
      content={
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          height="100%"
          data-testid="InstallAppModal"
        >
          <Empty
            icon={IlluCozyCloud}
            iconSize="large"
            title={t('InstallAppModal.title')}
            text={
              <>
                <span className="u-db">{t('InstallAppModal.text')}</span>
                <Button
                  className="u-mt-1-half"
                  label={t(`InstallAppModal.action.${name}`)}
                  component="a"
                  href={url}
                  target="_blank"
                  rel="noopener"
                />
              </>
            }
          />
        </Box>
      }
    />
  )
}

InstallAppModal.propTypes = {
  onBack: PropTypes.func
}

export default InstallAppModal
