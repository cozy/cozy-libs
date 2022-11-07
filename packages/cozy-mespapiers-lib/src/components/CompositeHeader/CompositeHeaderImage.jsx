import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import { makeStyles } from 'cozy-ui/transpiled/react/styles'
import Icon, { iconPropType } from 'cozy-ui/transpiled/react/Icon'

import IlluCovidVaccineCertificate from '../../assets/images/IlluCovidVaccineCertificate.png'
import IlluDiploma from '../../assets/images/IlluDiploma.png'
import IlluDriverLicenseBack from '../../assets/images/IlluDriverLicenseBack.png'
import IlluDriverLicenseFront from '../../assets/images/IlluDriverLicenseFront.png'
import IlluDriverLicenseNumberHelp from '../../assets/images/IlluDriverLicenseNumberHelp.png'
import IlluDriverLicenseObtentionDateHelp from '../../assets/images/IlluDriverLicenseObtentionDateHelp.png'
import IlluIBAN from '../../assets/images/IlluIBAN.png'
import IlluIdCardBack from '../../assets/images/IlluIdCardBack.png'
import IlluIdCardExpirationDateHelp from '../../assets/images/IlluIdCardExpirationDateHelp.png'
import IlluIdCardFront from '../../assets/images/IlluIdCardFront.png'
import IlluIdCardNumberHelp from '../../assets/images/IlluIdCardNumberHelp.png'
import IlluInvoice from '../../assets/images/IlluInvoice.png'
import IlluResidencePermitBack from '../../assets/images/IlluResidencePermitBack.png'
import IlluResidencePermitExpirationDateHelp from '../../assets/images/IlluResidencePermitExpirationDateHelp.png'
import IlluResidencePermitFront from '../../assets/images/IlluResidencePermitFront.png'
import IlluResidencePermitNumberHelp from '../../assets/images/IlluResidencePermitNumberHelp.png'
import IlluVehicleRegistration from '../../assets/images/IlluVehicleRegistration.png'
import IlluPassport from '../../assets/images/IlluPassport.png'
import IlluPassportNumber from '../../assets/images/IlluPassportNumber.png'
import IlluPassportDate from '../../assets/images/IlluPassportDate.png'
import IlluGenericInputDate from '../../assets/icons/IlluGenericInputDate.svg'
import IlluGenericInputText from '../../assets/icons/IlluGenericInputText.svg'
import IlluGenericNewPage from '../../assets/icons/IlluGenericNewPage.svg'
import Account from '../../assets/icons/Account.svg'

const images = {
  IlluCovidVaccineCertificate,
  IlluDiploma,
  IlluDriverLicenseBack,
  IlluDriverLicenseFront,
  IlluDriverLicenseNumberHelp,
  IlluDriverLicenseObtentionDateHelp,
  IlluIBAN,
  IlluIdCardBack,
  IlluIdCardExpirationDateHelp,
  IlluIdCardFront,
  IlluIdCardNumberHelp,
  IlluInvoice,
  IlluResidencePermitBack,
  IlluResidencePermitExpirationDateHelp,
  IlluResidencePermitFront,
  IlluResidencePermitNumberHelp,
  IlluVehicleRegistration,
  IlluGenericInputDate,
  IlluGenericInputText,
  IlluGenericNewPage,
  IlluPassport,
  IlluPassportNumber,
  IlluPassportDate,
  Account
}

const useStyles = makeStyles(() => ({
  image: {
    '&--small': {
      height: '4rem'
    },
    '&--medium': {
      height: '6rem'
    },
    '&--large': {
      height: '8rem'
    }
  }
}))

const CompositeHeaderImage = ({ icon, fallbackIcon, iconSize = 'large' }) => {
  const styles = useStyles()

  if (!icon && !fallbackIcon) {
    return null
  }

  const iconName = icon && icon.split('.')[0]
  const src = images[iconName] || fallbackIcon
  const isBitmap = typeof src === 'string' && src.endsWith('.png')

  if (isBitmap) {
    return (
      <img
        data-testid={src}
        src={src}
        alt="illustration"
        style={{ maxWidth: '16.25rem' }}
      />
    )
  }

  return (
    <div
      data-testid={src}
      className={cx('u-pb-1', {
        [`${styles.image}--${iconSize}`]: iconSize
      })}
    >
      <Icon icon={src} size="100%" />
    </div>
  )
}

CompositeHeaderImage.propTypes = {
  icon: iconPropType,
  fallbackIcon: iconPropType,
  iconSize: PropTypes.oneOf(['small', 'medium', 'large'])
}

export default CompositeHeaderImage
