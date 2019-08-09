import React from 'react'
import { translate, Button } from 'cozy-ui/transpiled/react/'

const CreateAccount = translate()(({ createAction, t }) => {
  return (
    <Button
      subtle
      size={'small'}
      className={'u-m-half'}
      onClick={createAction}
      label={t('modal.addAccount.button')}
    />
  )
})

export default CreateAccount
