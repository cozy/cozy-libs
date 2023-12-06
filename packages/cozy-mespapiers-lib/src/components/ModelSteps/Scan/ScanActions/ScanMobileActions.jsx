import PropTypes from 'prop-types'
import React, { useState } from 'react'

import flag from 'cozy-flags'
import Button from 'cozy-ui/transpiled/react/Buttons'
import Divider from 'cozy-ui/transpiled/react/Divider'
import FileInput from 'cozy-ui/transpiled/react/FileInput'
import Icon from 'cozy-ui/transpiled/react/Icon'
import PointerAlert from 'cozy-ui/transpiled/react/PointerAlert'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { usePapersCreated } from '../../../Contexts/PapersCreatedProvider'
import { usePaywall } from '../../../Contexts/PaywallProvider'
import { useStepperDialog } from '../../../Hooks/useStepperDialog'
import InstallAppModal from '../InstallAppModal'

const styleBtn = { color: 'var(--primaryTextColor)' }

const ScanMobileActions = ({ onOpenFilePickerModal, onChangeFile }) => {
  const [showInstallAppModal, setShowInstallAppModal] = useState(false)
  const { t } = useI18n()
  const { isPaywallActivated, setShowPaywall } = usePaywall()
  const { countPaperCreatedByMesPapiers } = usePapersCreated()
  const { currentStepIndex } = useStepperDialog()

  const handleEvent = (evt, callback) => {
    if (isPaywallActivated) {
      setShowPaywall(true)
    } else {
      callback(evt)
    }
  }

  return (
    <>
      <div>
        <Divider textAlign="center" className="u-mv-1">
          {t('Scan.divider')}
        </Divider>
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
          data-testid="importPicFromMobile-btn"
        >
          <Button
            variant="secondary"
            component="a"
            style={styleBtn}
            startIcon={<Icon icon="phone-upload" />}
            fullWidth
            className="u-m-0"
            label={t('Scan.importPicFromMobile')}
          />
        </FileInput>
      </div>
      {flag('mespapiers.aa-suggestion.disabled') ? (
        <FileInput
          onChange={onChangeFile}
          className="u-w-100 u-ta-center u-ml-0"
          onClick={e => e.stopPropagation()}
          capture="environment"
          accept="image/jpeg,image/png"
          data-testid="takePic-btn"
        >
          <Button
            startIcon={<Icon icon="camera" />}
            component="a"
            fullWidth
            className="u-m-0"
            label={t('Scan.takePic')}
          />
        </FileInput>
      ) : (
        <>
          <Button
            startIcon={<Icon icon="camera" />}
            onClick={() => setShowInstallAppModal(true)}
            fullWidth
            className="u-m-0"
            label={t('Scan.takePic')}
            data-testid="takePic-btn"
          />

          {showInstallAppModal && (
            <InstallAppModal onBack={() => setShowInstallAppModal(false)} />
          )}
        </>
      )}
      {countPaperCreatedByMesPapiers === 0 && currentStepIndex === 0 && (
        <PointerAlert className="u-mb-1 u-ta-center" icon={false}>
          {t('Scan.helpTooltip')}
        </PointerAlert>
      )}
    </>
  )
}

ScanMobileActions.propTypes = {
  onChangeFile: PropTypes.func,
  onOpenFilePickerModal: PropTypes.func
}

export default ScanMobileActions
