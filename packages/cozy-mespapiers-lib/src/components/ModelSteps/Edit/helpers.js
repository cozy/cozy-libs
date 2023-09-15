import { getReferencedBy } from 'cozy-client'

import { CONTACTS_DOCTYPE, FILES_DOCTYPE } from '../../../doctypes'

/**
 * Checks if the edition of the metadata of type "Information" is permitted
 */
export const isInformationEditPermitted = currentEditInformation => {
  if (!currentEditInformation) return false

  return !!(
    currentEditInformation?.searchParams?.metadataName !== 'datetime' &&
    currentEditInformation?.currentStep
  )
}

export const updateFileMetadata = ({ file, type, metadataName, value }) => {
  let newMetadata = {
    ...file.metadata,
    [metadataName]: value[metadataName]
  }
  // Need to update the "datetime" attribute if the updated metadata == "file.metadata.datetimeLabel" attribute
  // Otherwise, "datetime" might not correspond to any date in the document
  if (type === 'date' && file.metadata.datetimeLabel === metadataName) {
    newMetadata = {
      ...newMetadata,
      datetime: value[metadataName]
    }
  }
  return newMetadata
}

const makeCurrentInformationStep = (currentPaperDef, metadataName) => {
  const currentInformationStep = currentPaperDef?.acquisitionSteps
    ?.filter(
      step =>
        step.model === 'information' &&
        step.attributes.some(attr => attr.name === metadataName) &&
        step.ocr !== 'only'
    )
    ?.map(step => {
      return {
        ...step,
        attributes: step.attributes.filter(attr => attr.name === metadataName)
      }
    })

  return currentInformationStep?.[0] ?? null
}

const getCurrentContactStep = currentPaperDef => {
  return (
    currentPaperDef?.acquisitionSteps?.find(step => step.model === 'contact') ??
    null
  )
}

export const makeCurrentStep = ({ paperDef, model, metadataName }) => {
  switch (model) {
    case 'information':
      return makeCurrentInformationStep(paperDef, metadataName)
    case 'page':
      return null
    case 'contact':
      return getCurrentContactStep(paperDef)
    default:
      return null
  }
}

export const updateReferencedContact = async ({
  client,
  currentFile,
  contactIdsSelected
}) => {
  const contactsReferenced = getReferencedBy(currentFile, CONTACTS_DOCTYPE)
  if (contactIdsSelected.length === contactsReferenced.length) {
    const unchangedContacts = contactIdsSelected.every(contactId =>
      contactsReferenced.some(contactRef => contactRef.id === contactId)
    )
    if (unchangedContacts) return
  }

  const fileCollection = client.collection(FILES_DOCTYPE)

  const contactsReferencedNormalized = contactsReferenced.map(c => ({
    _id: c.id,
    _type: c.type
  }))
  await fileCollection.removeReferencedBy(
    currentFile,
    contactsReferencedNormalized
  )

  const newContactReferences = contactIdsSelected.map(contactId => ({
    _id: contactId,
    _type: CONTACTS_DOCTYPE
  }))
  await fileCollection.addReferencedBy(currentFile, newContactReferences)

  await client.save(currentFile)
}

export const getPaperDefinitionByFile = (papersDefinitions, file) => {
  return papersDefinitions.find(paper => {
    const countryCondition =
      Object.keys(file.metadata).includes('country') && paper.country
        ? file.metadata.country === 'fr'
          ? paper.country === 'fr'
          : paper.country === 'stranger'
        : true

    return paper.label === file.metadata.qualification.label && countryCondition
  })
}
