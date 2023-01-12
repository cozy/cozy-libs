/**
 * Check if a file is already selected in the state of the FormDataProvider
 * @param {object} formData - State of the FormDataProvider
 * @param {number} stepIndex - Used to know if the file is already selected for this step (Some paper have two Scan steps)
 * @param {File|Blob} currentFile - File or Blob object
 * @returns
 */
export const isFileAlreadySelected = (formData, stepIndex, currentFile) => {
  for (const data of formData.data) {
    if (data.stepIndex === stepIndex) {
      if (
        currentFile.constructor.name === 'Blob' &&
        data.file.id === currentFile.id
      ) {
        return true
      }
      if (
        currentFile.constructor.name === 'File' &&
        data.file.name === currentFile.name &&
        data.file.lastModified === currentFile.lastModified
      ) {
        return true
      }
    }
  }
  return false
}
