import PropTypes from 'prop-types'
import React, { createRef } from 'react'

import { useClient, useQuery, hasQueryBeenLoaded } from 'cozy-client'
import flag from 'cozy-flags'
import log from 'cozy-logger'
import Button from 'cozy-ui/transpiled/react/Buttons'
import Divider from 'cozy-ui/transpiled/react/Divider'
import FileInput from 'cozy-ui/transpiled/react/FileInput'
import Icon from 'cozy-ui/transpiled/react/Icon'
import useEventListener from 'cozy-ui/transpiled/react/hooks/useEventListener'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import ScanDesktopActionsAlert from './ScanDesktopActionsAlert'
import { KEYS } from '../../../../constants/const'
import { SETTINGS_DOCTYPE } from '../../../../doctypes'
import { getAppSettings } from '../../../../helpers/queries'
import { usePaywall } from '../../../Contexts/PaywallProvider'

const styleBtn = { color: 'var(--primaryTextColor)' }

const ScanDesktopActions = ({ onOpenFilePickerModal, onChangeFile }) => {
  const { t } = useI18n()
  const buttonRef = createRef()
  const client = useClient()
  const { isPaywallActivated, setShowPaywall } = usePaywall()

  const { data: settingsData, ...settingsQueryResult } = useQuery(
    getAppSettings.definition,
    getAppSettings.options
  )
  const isLoadedSettings = hasQueryBeenLoaded(settingsQueryResult)
  const showAlert = flag('mespapiers.aa-suggestion.disabled')
    ? false
    : isLoadedSettings
    ? settingsData[0].showScanDesktopActionsAlert ?? true
    : true

  const handleKeyDown = ({ key }) => {
    if (key === KEYS.ENTER && buttonRef.current) {
      buttonRef.current.click()
    }
  }
  useEventListener(window, 'keydown', handleKeyDown)

  const handleHideAlert = async () => {
    if (isLoadedSettings) {
      try {
        await client.save({
          ...settingsData[0],
          showScanDesktopActionsAlert: false,
          _type: SETTINGS_DOCTYPE
        })
      } catch (error) {
        log('error', 'Error when saving settings in ScanDesktopActions', error)
      }
    } else {
      log(
        'warn',
        'Settings are not loaded when clicking to hide ScanDesktopActionsAlert'
      )
    }
  }

  const handleEvent = (evt, callback) => {
    if (isPaywallActivated) {
      setShowPaywall(true)
    } else {
      callback(evt)
    }
  }

  return (
    <>
      <Button
        variant="secondary"
        style={styleBtn}
        onClick={evt => handleEvent(evt, onOpenFilePickerModal)}
        startIcon={<Icon icon="folder-moveto" />}
        label={t('Scan.selectPicFromCozy')}
        data-testid="selectPicFromCozy-btn"
      />
      <FileInput
        onChange={evt => handleEvent(evt, onChangeFile)}
        className="u-w-100 u-ml-0"
        onClick={e => e.stopPropagation()}
        accept="application/pdf,image/jpeg,image/png"
        data-testid="importPicFromDesktop-btn"
      >
        <Button
          startIcon={<Icon icon="phone-upload" />}
          component="a"
          ref={buttonRef}
          className="u-w-100 u-m-0 u-mb-1"
          label={t('Scan.importPicFromDesktop')}
        />
      </FileInput>
      {showAlert && (
        <div className="u-w-100 u-mv-1">
          <Divider textAlign="center">{t('Scan.divider')}</Divider>
        </div>
      )}
      {showAlert && <ScanDesktopActionsAlert onClose={handleHideAlert} />}
    </>
  )
}

ScanDesktopActions.propTypes = {
  onChangeFile: PropTypes.func,
  onOpenFilePickerModal: PropTypes.func
}

export default ScanDesktopActions
