import React, { isValidElement } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import isArray from 'lodash/isArray'
import { makeStyles } from '@material-ui/core/styles'

import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import Typography from 'cozy-ui/transpiled/react/Typography'
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
  Account
}

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center',
    height: '100%',
    maxWidth: '100%',
    margin: '2rem 0 1rem',
    '&.is-focused': {
      height: 'initial'
    },
    '& img': {
      width: 'fit-content',
      margin: '0 auto'
    }
  },
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

const CompositeHeaderImage = ({ icon, fallbackIcon, iconSize }) => {
  const styles = useStyles()

  const iconName = icon.split('.')[0]
  const src = images[iconName] || fallbackIcon
  const isBitmap = typeof src === 'string' && !src.endsWith('.svg')

  if (isBitmap) {
    return <img data-testid={src} src={src} alt="illustration" />
  }

  return (
    <div
      data-testid={src}
      className={cx('u-pb-1', {
        [`${styles.image}--${iconSize}`]: iconSize
      })}
    >
      <Icon icon={src} size={'100%'} />
    </div>
  )
}

// TODO Test and improve it & PR cozy-ui
const CompositeHeader = ({
  icon,
  fallbackIcon,
  iconSize,
  title: Title,
  text: Text,
  className,
  ...restProps
}) => {
  const { isMobile } = useBreakpoints()
  const styles = useStyles()

  return (
    <div className={cx(styles.container, className)} {...restProps}>
      <CompositeHeaderImage
        icon={icon}
        fallbackIcon={fallbackIcon}
        iconSize={iconSize}
      />
      {Title &&
        (isValidElement(Title) ? (
          Title
        ) : (
          <Typography variant="h5" color="textPrimary" className={'u-mh-2'}>
            {Title}
          </Typography>
        ))}
      {Text &&
        (isValidElement(Text) || isArray(Text) ? (
          <div
            className={cx({
              ['u-mv-1']: !isMobile || (isArray(Text) && Text.length <= 1),
              ['u-mt-1 u-mah-5 u-pv-1 u-ov-scroll']:
                isMobile && isArray(Text) && Text.length > 1
            })}
          >
            {Text}
          </div>
        ) : (
          <Typography variant="body1" className={'u-mt-1'}>
            {Text}
          </Typography>
        ))}
    </div>
  )
}

CompositeHeader.propTypes = {
  icon: iconPropType.isRequired,
  fallbackIcon: iconPropType,
  iconSize: PropTypes.oneOf(['small', 'medium', 'large']),
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  text: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.arrayOf(PropTypes.node)
  ]),
  className: PropTypes.string
}
CompositeHeader.defaultProps = {
  iconSize: 'large'
}

export default CompositeHeader
