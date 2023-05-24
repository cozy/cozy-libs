import PropTypes from 'prop-types'
import React from 'react'

import { IllustrationDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Link from 'cozy-ui/transpiled/react/Link'
import Typography from 'cozy-ui/transpiled/react/Typography'

import QRCode from '../../../../assets/images/QRCode.png'
import appStoreIcon from '../../../../assets/images/appstore.png'
import playStoreIcon from '../../../../assets/images/playstore.png'
import { ANDROID_APP_URL, IOS_APP_URL } from '../../../../constants/const'

const QRCodeModal = ({ onClose }) => {
  const { t, lang } = useI18n()

  return (
    <IllustrationDialog
      open
      size="small"
      transitionDuration={0}
      disableGutters
      onClose={onClose}
      content={
        <div
          className="u-flex u-flex-column u-flex-items-center u-flex-justify-center u-pt-3 u-pb-2 u-ph-1-half"
          data-testid="QRCodeModal"
        >
          <Link
            href={`https://cozy.io/${lang}/download`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={QRCode} width="100%" alt="" aria-hidden />
            <span className="u-visuallyhidden">{t('QRCodeModal.a11n')}</span>
          </Link>
          <Typography gutterBottom variant="h3" color="textPrimary">
            {t('QRCodeModal.title')}
          </Typography>
          <Typography
            color="textSecondary"
            className="u-ta-center"
            dangerouslySetInnerHTML={{
              __html: t('QRCodeModal.text', {
                androidUrl: ANDROID_APP_URL,
                androidIconSrc: playStoreIcon,
                iosUrl: IOS_APP_URL,
                iosIconSrc: appStoreIcon
              })
            }}
          />
        </div>
      }
    />
  )
}

QRCodeModal.propTypes = {
  onClose: PropTypes.func
}

export default QRCodeModal
