import React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { useClient } from 'cozy-client'
import IntentModal from 'cozy-ui/transpiled/react/deprecated/IntentModal'

import { APPS_DOCTYPE } from '../../doctypes'

const InstallKonnectorFromIntent = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const client = useClient()
  const konnectorSlug = searchParams.get('slug')
  const konnectorCategory = searchParams.get('category')

  const handleTerminate = ({ document }) => {
    const redirectLink = `${searchParams.get('redirectAfterInstall')}${
      document.slug
    }`

    return navigate(`${redirectLink}`, {
      replace: true
    })
  }

  const handleClose = () => {
    return navigate('..')
  }

  return (
    <IntentModal
      action="INSTALL"
      doctype={APPS_DOCTYPE}
      mobileFullscreen
      options={{
        terminateIfInstalled: true,
        slug: konnectorSlug,
        pageToDisplay: 'details',
        category: konnectorCategory,
        configure: false
      }}
      create={client.intents.create}
      onComplete={handleTerminate}
      dismissAction={handleClose}
    />
  )
}

export default InstallKonnectorFromIntent
