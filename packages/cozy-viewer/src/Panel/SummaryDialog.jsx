import PropTypes from 'prop-types'
import React, { useState } from 'react'

import { useClient } from 'cozy-client'
import Button from 'cozy-ui/transpiled/react/Buttons'
import { ConfirmDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import TextField from 'cozy-ui/transpiled/react/TextField'

import { withViewerLocales } from '../hoc/withViewerLocales'

const SummaryDialog = ({ file, t, onClose }) => {
  const [value, setValue] = useState(file.metadata.description)
  const [busy, setBusy] = useState(false)
  const client = useClient()

  const handleSubmit = async () => {
    setBusy(true)
    await client.collection('io.cozy.files').updateMetadataAttribute(file._id, {
      ...file.metadata,
      description: value
    })
    onClose()
  }

  return (
    <ConfirmDialog
      open
      title={t('Viewer.panel.summary')}
      content={
        <TextField
          multiline
          value={value}
          rows={4}
          autoFocus
          fullWidth
          required
          variant="outlined"
          onChange={ev => setValue(ev.target.value)}
        />
      }
      actions={
        <>
          <Button
            className="u-miw-4"
            variant="secondary"
            label={t('Viewer.cancel')}
            onClick={onClose}
          />
          <Button
            className="u-miw-4"
            label={t('Viewer.ok')}
            busy={busy}
            onClick={handleSubmit}
          />
        </>
      }
      onClose={onClose}
    />
  )
}

SummaryDialog.propTypes = {
  file: PropTypes.object.isRequired,
  t: PropTypes.func,
  onClose: PropTypes.func
}

export default withViewerLocales(SummaryDialog)
