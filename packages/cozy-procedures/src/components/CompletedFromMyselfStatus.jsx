import React from 'react'
import { translate, Bold } from 'cozy-ui/transpiled/react/'

export const CompletedFromMyselfStatus = ({ completed, total, t }) => {
  if (completed === 0) {
    return null
  }

  return (
    <div className="u-mt-1-half u-ml-half u-mr-half u-ta-center">
      <Bold tag="span" className="u-weirdGreen">
        {t('personalDataForm.completedStatus.main', {
          smart_count: completed,
          total
        })}
      </Bold>{' '}
      {t('personalDataForm.completedStatus.rest', { smart_count: completed })}
    </div>
  )
}

export default translate()(CompletedFromMyselfStatus)
