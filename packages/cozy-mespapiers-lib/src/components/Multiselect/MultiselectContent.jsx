import React from 'react'

import List from 'cozy-ui/transpiled/react/List'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import GhostButton from './GhostButton'
import { useMultiSelection } from '../Hooks/useMultiSelection'
import PaperCardItem from '../Papers/PaperCardItem'

const MultiselectContent = ({ setIsFilePickerActive }) => {
  const { t } = useI18n()
  const { allMultiSelectionFiles } = useMultiSelection()

  return (
    <div className="u-mb-2 u-w-100">
      <Typography variant="h6" className="u-mb-1">
        {t('Multiselect.subtitle')}
      </Typography>
      <List className="u-flex u-flex-column u-flex-justify-center u-pv-0">
        {allMultiSelectionFiles.map((file, idx) => (
          <PaperCardItem
            key={`${file._id}${idx}`}
            paperIndex={idx}
            paper={file}
            className="u-mb-half u-w-100"
          />
        ))}
      </List>
      <GhostButton
        label={t('Multiselect.select')}
        fullWidth
        onClick={() => setIsFilePickerActive(true)}
      />
    </div>
  )
}

export default MultiselectContent
