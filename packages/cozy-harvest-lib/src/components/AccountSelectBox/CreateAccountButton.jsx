import React from 'react'

import Button from 'cozy-ui/transpiled/react/Buttons'
import { translate } from 'cozy-ui/transpiled/react/providers/I18n'

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
      variant="text"
      size="small"
      className="u-m-half"
      onClick={createAction}
      onTouchEnd={createAction}
      label={t('modal.addAccount.button')}
    />
  )
})

export default CreateAccount
