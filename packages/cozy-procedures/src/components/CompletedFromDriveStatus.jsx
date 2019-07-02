import React from 'react'
import { translate } from 'cozy-ui/transpiled/react/I18n'

export const CompletedFromDriveStatus = ({ completed, total, t }) => {
  if (completed === 0) {
    return null
  }

  return (
    <div>
      <span className="u-weirdGreen">
        {t('documents.completedStatus.main', {
          smart_count: completed,
          total
        })}
      </span>{' '}
      {t('documents.completedStatus.rest', { smart_count: completed })}
    </div>
  )
}

export default translate()(CompletedFromDriveStatus)
