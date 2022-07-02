import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import { useClient } from 'cozy-client'
import makeStyles from 'cozy-ui/transpiled/react/helpers/makeStyles'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Typography from 'cozy-ui/transpiled/react/Typography'
import Icon, { iconPropType } from 'cozy-ui/transpiled/react/Icon'
import { ActionMenuItem } from 'cozy-ui/transpiled/react/ActionMenu'
import AppLinker from 'cozy-ui/transpiled/react/AppLinker'
import Link from 'cozy-ui/transpiled/react/Link'

import Konnector from '../../assets/icons/Konnectors.svg'
import { getStoreWebLinkByKonnector } from '../../helpers/getStoreWebLinkByKonnector'

const useStyles = makeStyles(theme => ({
  disabledItem: {
    cursor: 'default',
    '&:hover': {
      backgroundColor: 'initial'
    }
  },
  icon: {
    margin: '0 4px'
  },
  disabledIcon: {
    fill: theme.palette.text.disabled
  },
  disabledTypography: {
    color: theme.palette.text.disabled
  }
}))

const ImportDropdownItems = ({ placeholder, onClick }) => {
  const { t } = useI18n()
  const client = useClient()
  const styles = useStyles()
  const {
    acquisitionSteps: { length: acquisitionStepsLength },
    connectorCriteria: { category: konnectorCategory, name: konnectorName } = {}
  } = placeholder
  const hasSteps = acquisitionStepsLength > 0

  return (
    <>
      <ActionMenuItem
        className={cx('u-flex-items-center', {
          [styles.disabledItem]: !hasSteps
        })}
        onClick={hasSteps ? onClick : null}
        left={
          <Icon
            className={cx(styles.icon, {
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
      <AppLinker
        app={{ slug: 'store' }}
        href={getStoreWebLinkByKonnector({
          konnectorName,
          konnectorCategory,
          client
        })}
      >
        {({ href, onClick }) => {
          return (
            <ActionMenuItem
              className={cx('u-flex-items-center')}
              left={<Icon icon={Konnector} size={24} />}
            >
              <Link
                href={href}
                onClick={onClick}
                target="_blank"
                style={{ padding: 0, whiteSpace: 'normal' }}
              >
                <Typography gutterBottom>
                  {t('ImportDropdown.importAuto.title')}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {t('ImportDropdown.importAuto.text')}
                </Typography>
              </Link>
            </ActionMenuItem>
          )
        }}
      </AppLinker>
    </>
  )
}

ImportDropdownItems.propTypes = {
  placeholder: PropTypes.shape({
    label: PropTypes.string,
    icon: iconPropType,
    acquisitionSteps: PropTypes.array.isRequired,
    connectorCriteria: PropTypes.shape({
      name: PropTypes.string,
      category: PropTypes.string
    })
  }).isRequired,
  onClick: PropTypes.func
}

export default ImportDropdownItems
