import React from 'react'
import { useHistory } from 'react-router-dom'

import Typography from 'cozy-ui/transpiled/react/Typography'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import List from 'cozy-ui/transpiled/react/MuiCozyTheme/List'

import GhostButton from './GhostButton'
import PaperCardItem from '../Papers/PaperCardItem'
import { useMultiSelection } from '../Hooks/useMultiSelection'

const MultiselectContent = () => {
  const { t } = useI18n()
  const history = useHistory()
  const { multiSelectionFiles } = useMultiSelection()

  return (
    <div className="u-mb-2 u-w-100">
      {multiSelectionFiles.length === 0 ? (
        <Typography variant="h6" className="u-mb-1">
          {t('Multiselect.empty')}
        </Typography>
      ) : (
        <List className="u-flex u-flex-column u-flex-justify-center">
          {multiSelectionFiles.map(file => (
            <PaperCardItem
              key={file._id}
              paper={file}
              className="u-mb-half u-w-100"
            />
          ))}
        </List>
      )}
      <GhostButton
        label={t('Multiselect.select')}
        fullWidth
        onClick={() => history.push(`/paper`)}
      />
    </div>
  )
}

export default MultiselectContent
