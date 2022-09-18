/**
 * Checks if the edition of the metadata of type "Information" is permitted
 */
export const isInformationEditPermitted = currentEditInformation => {
  if (!currentEditInformation) return false

  return !!(
    currentEditInformation?.searchParams?.metadataName !== 'datetime' &&
    currentEditInformation?.currentStep &&
    currentEditInformation?.file?.metadata[
      currentEditInformation?.searchParams?.metadataName
    ]
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
