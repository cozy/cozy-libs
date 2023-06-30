import React from 'react'

import { translate } from 'cozy-ui/transpiled/react/I18n'
import Button from 'cozy-ui/transpiled/react/deprecated/Button'

/**
 * onClick is not called when we are on mobile device.
 * It seems that react-select captures this event before us
 * and when we clicked on this button, the selectbox closed itself
 *
 * Using touchEnd, seems to fix the issue on mobile device (Android & iOS)
 */
const CreateAccount = translate()(({ createAction, t }) => {
  return (
    <Button
      subtle
      size="small"
      className="u-m-half"
      onClick={createAction}
      onTouchEnd={createAction}
      label={t('modal.addAccount.button')}
    />
  )
})

export default CreateAccount
