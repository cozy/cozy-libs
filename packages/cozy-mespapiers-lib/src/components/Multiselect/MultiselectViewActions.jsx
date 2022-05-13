import React from 'react'

import { useClient } from 'cozy-client'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Button from 'cozy-ui/transpiled/react/Buttons'

import { downloadFiles, forwardFile } from '../Actions/utils'
import { useMultiSelection } from '../Hooks/useMultiSelection'

const MultiselectViewActions = () => {
  const { t } = useI18n()
  const client = useClient()
  const { multiSelectionFiles } = useMultiSelection()

  const download = async () => {
    await downloadFiles(client, multiSelectionFiles)
  }

  const forward = async () => {
    await forwardFile(client, multiSelectionFiles, t)
  }

  return (
    <>
      <Button
        variant="secondary"
        label={t('action.download')}
        onClick={download}
        disabled={multiSelectionFiles.length === 0}
      />
      {navigator.share && (
        <Button
          variant="secondary"
          label={t('action.forward')}
          onClick={forward}
          disabled={multiSelectionFiles.length === 0}
        />
      )}
    </>
  )
}

export default MultiselectViewActions
