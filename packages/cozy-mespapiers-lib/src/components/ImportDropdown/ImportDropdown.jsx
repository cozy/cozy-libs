import React, { useCallback } from 'react'
import PropTypes from 'prop-types'

import { useClient, generateWebLink } from 'cozy-client'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Typography from 'cozy-ui/transpiled/react/Typography'
import Icon, { iconPropType } from 'cozy-ui/transpiled/react/Icon'
import IconStack from 'cozy-ui/transpiled/react/IconStack'
import FileDuotoneIcon from 'cozy-ui/transpiled/react/Icons/FileDuotone'
import Camera from 'cozy-ui/transpiled/react/Icons/Camera'
import Close from 'cozy-ui/transpiled/react/Icons/CrossMedium'
import {
  ActionMenuHeader,
  ActionMenuItem
} from 'cozy-ui/transpiled/react/ActionMenu'
import { Media, Img, Bd } from 'cozy-ui/transpiled/react/Media'

import { useStepperDialog } from '../Hooks/useStepperDialog'
import { useScannerI18n } from '../Hooks/useScannerI18n'
import Konnector from '../../assets/icons/Konnectors.svg'

const ImportDropdown = ({ label, icon, hasSteps, onClick, onClose }) => {
  const { t } = useI18n()
  const client = useClient()
  const scannerT = useScannerI18n()
  const { currentDefinition } = useStepperDialog()
  const konnectorCategory = currentDefinition?.connectorCriteria?.category
  const konnectorName = currentDefinition?.connectorCriteria?.name

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
    // TODO Do not use window.open for redirect, prefer use a link (href)
    window.open(webLink, '_blank')
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
            <IconStack
              backgroundIcon={
                <Icon
                  icon={FileDuotoneIcon}
                  color="var(--primaryColor)"
                  size={32}
                />
              }
              foregroundIcon={
                <Icon icon={icon} color="var(--primaryColor)" size={16} />
              }
            />
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
                  icon={Close}
                  className="u-c-pointer u-pl-half"
                  onClick={onClose}
                />
              </div>
            )}
          </Bd>
        </Media>
      </ActionMenuHeader>
      <ActionMenuItem
        className="u-flex-items-center"
        onClick={handleClick}
        left={<Icon icon={Camera} size={16} />}
        disabled={!hasSteps}
      >
        <Typography variant="body1" gutterBottom>
          {t('ImportDropdown.scanPicture.title')}
        </Typography>
        <Typography variant="caption" color="textSecondary">
          {t('ImportDropdown.scanPicture.text')}
        </Typography>
      </ActionMenuItem>
      <ActionMenuItem
        className="u-flex-items-center"
        left={<Icon icon={Konnector} size={24} />}
        onClick={konnectorCategory || konnectorName ? goToStore : null}
        disabled={konnectorCategory || konnectorName ? false : true}
      >
        <Typography variant="body1" gutterBottom>
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
  label: PropTypes.string.isRequired,
  icon: iconPropType.isRequired,
  hasSteps: PropTypes.bool,
  onClose: PropTypes.func,
  onClick: PropTypes.func
}

export default React.memo(ImportDropdown)
