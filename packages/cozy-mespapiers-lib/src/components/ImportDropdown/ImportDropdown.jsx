import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import { useClient, generateWebLink } from 'cozy-client'
import makeStyles from 'cozy-ui/transpiled/react/helpers/makeStyles'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Typography from 'cozy-ui/transpiled/react/Typography'
import Icon, { iconPropType } from 'cozy-ui/transpiled/react/Icon'
import {
  ActionMenuHeader,
  ActionMenuItem
} from 'cozy-ui/transpiled/react/ActionMenu'
import { Media, Img, Bd } from 'cozy-ui/transpiled/react/Media'
import { useWebviewIntent } from 'cozy-intent'

import FileIcon from '../Icons/FileIcon'
import { useScannerI18n } from '../Hooks/useScannerI18n'
import Konnector from '../../assets/icons/Konnectors.svg'

const useStyles = makeStyles(theme => ({
  disabledItem: {
    cursor: 'default',
    '&:hover': {
      backgroundColor: 'initial'
    }
  },
  disabledIcon: {
    fill: theme.palette.text.disabled
  },
  disabledTypography: {
    color: theme.palette.text.disabled
  }
}))

const ImportDropdown = ({ placeholder, onClick, onClose }) => {
  const { t } = useI18n()
  const client = useClient()
  const scannerT = useScannerI18n()
  const {
    label,
    icon,
    acquisitionSteps: { length: acquisitionStepsLength },
    connectorCriteria: { category: konnectorCategory, name: konnectorName } = {}
  } = placeholder
  const hasSteps = acquisitionStepsLength > 0
  const styles = useStyles()
  const webviewIntent = useWebviewIntent()

  const goToStore = () => {
    let hash
    if (konnectorName) hash = `discover/${konnectorName}`
    else hash = `discover?type=konnector&category=${konnectorCategory}`
    const webLink = generateWebLink({
      slug: 'store',
      cozyUrl: client.getStackClient().uri,
      subDomainType: client.getInstanceOptions().subdomain,
      pathname: '/',
      hash
    })

    webviewIntent?.call('openApp', webLink, { slug: webLink.slug }) || // TODO Prefer <AppLinker />
      window.open(webLink, '_blank') // TODO Do not use window.open for redirect, prefer use a link (href)
  }

  const handleClick = useCallback(() => {
    if (hasSteps) {
      onClick()
    }
  }, [hasSteps, onClick])

  return (
    <>
      <ActionMenuHeader>
        <Media>
          <Img>
            <FileIcon icon={icon} />
          </Img>
          <Bd className="u-ml-1 u-flex u-flex-items-center u-flex-justify-between">
            <Typography variant="h6">
              {t('ImportDropdown.title', {
                name: scannerT(`items.${label}`)
              })}
            </Typography>
            {onClose && (
              <div className="u-flex">
                <Icon
                  icon="cross-medium"
                  className="u-c-pointer u-pl-half"
                  onClick={onClose}
                />
              </div>
            )}
          </Bd>
        </Media>
      </ActionMenuHeader>
      <ActionMenuItem
        className={cx('u-flex-items-center', {
          [styles.disabledItem]: !hasSteps
        })}
        onClick={hasSteps ? handleClick : null}
        left={
          <Icon
            className={cx({
              [styles.disabledIcon]: !hasSteps
            })}
            icon="camera"
            size={16}
          />
        }
      >
        <Typography
          className={cx({
            [styles.disabledTypography]: !hasSteps
          })}
          gutterBottom
        >
          {t('ImportDropdown.scanPicture.title')}
        </Typography>
        <Typography
          className={cx({
            [styles.disabledTypography]: !hasSteps
          })}
          variant="caption"
          color="textSecondary"
        >
          {t('ImportDropdown.scanPicture.text')}
        </Typography>
      </ActionMenuItem>
      <ActionMenuItem
        className={cx('u-flex-items-center')}
        left={<Icon icon={Konnector} size={24} />}
        onClick={goToStore}
      >
        <Typography gutterBottom>
          {t('ImportDropdown.importAuto.title')}
        </Typography>
        <Typography variant="caption" color="textSecondary">
          {t('ImportDropdown.importAuto.text')}
        </Typography>
      </ActionMenuItem>
    </>
  )
}

ImportDropdown.propTypes = {
  placeholder: PropTypes.shape({
    label: PropTypes.string.isRequired,
    icon: iconPropType.isRequired,
    acquisitionSteps: PropTypes.array.isRequired,
    connectorCriteria: PropTypes.shape({
      name: PropTypes.string,
      category: PropTypes.string
    })
  }).isRequired,
  onClose: PropTypes.func,
  onClick: PropTypes.func
}

export default ImportDropdown
