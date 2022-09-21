import React, { useState } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router-dom'

import Spinner from 'cozy-ui/transpiled/react/Spinner'
import Backdrop from 'cozy-ui/transpiled/react/Backdrop'
import { makeStyles } from 'cozy-ui/transpiled/react/styles'
import { useClient } from 'cozy-client'

import { useCurrentEditInformations } from './useCurrentEditInformations'
import useReferencedContact from '../../Hooks/useReferencedContact'
import ContactEditDialog from './ContactEditDialog'
import { updateReferencedContact } from './helpers'

const useStyles = makeStyles({
  backdropRoot: {
    zIndex: 'var(--zIndex-modal)'
  }
})

const ContactEditWrapper = () => {
  const { fileId } = useParams()
  const navigate = useNavigate()
  const client = useClient()
  const classes = useStyles()

  const currentEditInformation = useCurrentEditInformations(fileId, 'contact')
  const { isLoadingContacts, contacts } = useReferencedContact(
    currentEditInformation.file
  )
  const [isBusy, setIsBusy] = useState(false)

  const onClose = () => {
    navigate(currentEditInformation.searchParams.backgroundPath)
  }

  const onConfirm = async contactIdsSelected => {
    setIsBusy(true)
    await updateReferencedContact({
      client,
      currentFile: currentEditInformation.file,
      contactIdsSelected
    })
    onClose()
  }
  const isLoading = currentEditInformation.isLoading || isLoadingContacts

  if (!isLoading && !currentEditInformation.file) {
    return <Navigate to={currentEditInformation.searchParams.backgroundPath} />
  }

  return !isLoading ? (
    <ContactEditDialog
      contacts={contacts}
      currentEditInformation={currentEditInformation}
      onConfirm={onConfirm}
      onClose={onClose}
      isBusy={isBusy}
    />
  ) : (
    <Backdrop open classes={{ root: classes.backdropRoot }}>
      <Spinner size="xlarge" />
    </Backdrop>
  )
}

export default ContactEditWrapper
