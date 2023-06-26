import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'

import log from 'cozy-logger'
import Icon, { iconPropType } from 'cozy-ui/transpiled/react/Icon'
import { makeStyles } from 'cozy-ui/transpiled/react/styles'

import Account from '../../assets/icons/Account.svg'
import Contract from '../../assets/icons/Contract.svg'
import IlluGenericAlert from '../../assets/icons/IlluGenericAlert.svg'
import IlluGenericInputDate from '../../assets/icons/IlluGenericInputDate.svg'
import IlluGenericInputText from '../../assets/icons/IlluGenericInputText.svg'
import IlluGenericNewPage from '../../assets/icons/IlluGenericNewPage.svg'
import Planet from '../../assets/icons/Planet.svg'
import IlluCafNumberHelp from '../../assets/images/IlluCafNumberHelp.png'
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
import IlluNationalHealthInsuranceCardDateHelp from '../../assets/images/IlluNationalHealthInsuranceCardDateHelp.png'
import IlluNationalHealthInsuranceCardFront from '../../assets/images/IlluNationalHealthInsuranceCardFront.png'
import IlluNationalHealthInsuranceCardNumber from '../../assets/images/IlluNationalHealthInsuranceCardNumber.png'
import IlluPassport from '../../assets/images/IlluPassport.png'
import IlluPassportDate from '../../assets/images/IlluPassportDate.png'
import IlluPassportNumber from '../../assets/images/IlluPassportNumber.png'
import IlluResidencePermitBack from '../../assets/images/IlluResidencePermitBack.png'
import IlluResidencePermitExpirationDateHelp from '../../assets/images/IlluResidencePermitExpirationDateHelp.png'
import IlluResidencePermitFront from '../../assets/images/IlluResidencePermitFront.png'
import IlluResidencePermitNumberHelp from '../../assets/images/IlluResidencePermitNumberHelp.png'
import IlluVehicleRegistration from '../../assets/images/IlluVehicleRegistration.png'
import IlluWorkContract from '../../assets/images/IlluWorkContract.png'

const images = {
  IlluCafNumberHelp,
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
  IlluNationalHealthInsuranceCardDateHelp,
  IlluNationalHealthInsuranceCardFront,
  IlluNationalHealthInsuranceCardNumber,
  IlluResidencePermitBack,
  IlluResidencePermitExpirationDateHelp,
  IlluResidencePermitFront,
  IlluResidencePermitNumberHelp,
  IlluVehicleRegistration,
  IlluWorkContract,
  IlluGenericAlert,
  IlluGenericInputDate,
  IlluGenericInputText,
  IlluGenericNewPage,
  IlluPassport,
  IlluPassportNumber,
  IlluPassportDate,
  Account,
  Contract,
  Planet
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

const supportedBitmapExtensions = ['.png', '.jpg', '.jpeg', '.webp']

const isSupportedBitmapExtension = filename => {
  if (typeof filename !== 'string') return false

  return supportedBitmapExtensions.some(ext => filename.endsWith(ext))
}

/**
 * CompositeHeaderImage
 * @description Display an image or an icon
 * - If the image is a bitmap (.png, .jpg, .jpeg or .webp), it will be displayed as an image
 * - If the image is a vector, it will be displayed as an icon
 * @param {Object} props
 * @param {string} props.icon - Icon name (with extension)
 * @param {object} props.fallbackIcon - SVG filetype
 * @param {string} props.iconSize - Icon size (small, medium, large(default))
 * @returns {ReactElement|null}
 * @example
 * <CompositeHeaderImage icon="icon.svg" fallbackIcon="fallback.svg" iconSize="small" />
 */
const CompositeHeaderImage = ({ icon, fallbackIcon, iconSize = 'large' }) => {
  const styles = useStyles()

  if (!icon && !fallbackIcon) {
    return null
  }

  const iconName = icon?.split('.')[0]
  const src = images[iconName] || fallbackIcon
  const isVector = icon?.endsWith('.svg') || !!fallbackIcon
  const isBitmap = isSupportedBitmapExtension(icon)

  if (!isVector && !isBitmap) {
    log(
      'info',
      `Unsupported image ${icon}, please verify supported images here https://github.com/cozy/cozy-libs/blob/9fec28cd9a6303df5f9675d960addd2abd1554ed/packages/cozy-mespapiers-lib/src/components/CompositeHeader/CompositeHeaderImage.jsx#L37`
    )
    return null
  }

  if (isBitmap) {
    return (
      <img
        data-testid={src}
        src={src}
        alt=""
        style={{ maxWidth: '16.25rem' }}
        className={cx({
          [`${styles.image}--${iconSize}`]: iconSize
        })}
        aria-hidden="true"
      />
    )
  }

  return (
    <div
      data-testid={src}
      className={cx('u-pb-1', {
        [`${styles.image}--${iconSize}`]: iconSize
      })}
      aria-hidden="true"
    >
      <Icon icon={src} size="100%" />
    </div>
  )
}

CompositeHeaderImage.propTypes = {
  icon: iconPropType,
  fallbackIcon: PropTypes.object,
  iconSize: PropTypes.oneOf(['small', 'medium', 'large'])
}

export default CompositeHeaderImage
