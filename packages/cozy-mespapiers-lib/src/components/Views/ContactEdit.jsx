import React, { useState } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router-dom'

import { useClient } from 'cozy-client'
import Backdrop from 'cozy-ui/transpiled/react/Backdrop'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import { makeStyles } from 'cozy-ui/transpiled/react/styles'

import useReferencedContact from '../Hooks/useReferencedContact'
import ContactEditDialog from '../ModelSteps/Edit/ContactEditDialog'
import { updateReferencedContact } from '../ModelSteps/Edit/helpers'
import { useCurrentEditInformations } from '../ModelSteps/Edit/useCurrentEditInformations'

const useStyles = makeStyles({
  backdropRoot: {
    zIndex: 'var(--zIndex-modal)'
  }
})

const ContactEdit = () => {
  const { fileId } = useParams()
  const navigate = useNavigate()
  const client = useClient()
  const classes = useStyles()

  const currentEditInformation = useCurrentEditInformations(fileId, 'contact')
  const { isLoadingContacts, contacts } = useReferencedContact([
    currentEditInformation.file
  ])
  const [isBusy, setIsBusy] = useState(false)

  const onClose = () => {
    navigate('..')
  }

  const onConfirm = async contactSelected => {
    setIsBusy(true)
    const contactIdsSelected = contactSelected.map(contact => contact._id)

    // Rename only if one referenced contact exist and the contact step is not multiple
    if (
      contacts.length === 1 &&
      !currentEditInformation.currentStep?.multiple
    ) {
      const oldContactNameSelected = contacts[0].displayName
      const hasOldContactNameInFilename =
        currentEditInformation.file.name.includes(oldContactNameSelected)
      const hasDifferentContactSelected = contactSelected.every(
        contact => contact.displayName !== oldContactNameSelected
      )

      // Update filename if the old contact name is in the filename and the new contact selected is different
      if (hasOldContactNameInFilename && hasDifferentContactSelected) {
        const newContactNameSelected = contactSelected[0].displayName
        currentEditInformation.file = {
          ...currentEditInformation.file,
          name: currentEditInformation.file.name.replace(
            oldContactNameSelected,
            newContactNameSelected
          )
        }
      }
    }
    await updateReferencedContact({
      client,
      currentFile: currentEditInformation.file,
      contactIdsSelected
    })
    onClose()
  }
  const isLoading = currentEditInformation.isLoading || isLoadingContacts

  if (!isLoading && !currentEditInformation.file) {
    return <Navigate to=".." />
  }

  return isLoading ? (
    <Backdrop open classes={{ root: classes.backdropRoot }}>
      <Spinner size="xlarge" />
    </Backdrop>
  ) : (
    <ContactEditDialog
      contacts={contacts}
      currentEditInformation={currentEditInformation}
      onConfirm={onConfirm}
      onClose={onClose}
      isBusy={isBusy}
    />
  )
}

export default ContactEdit
