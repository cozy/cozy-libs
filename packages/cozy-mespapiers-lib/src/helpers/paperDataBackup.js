import {
  storeIndexedStorageData,
  removeIndexedStorageData,
  FORM_BACKUP_QUALIFICATION_LABEL_KEY,
  FORM_BACKUP_CURRENT_STEP_INDEX_KEY,
  FORM_BACKUP_FORM_DATA_KEY
} from '../utils/indexedStorage'

export const storePaperDataBackup = async ({
  qualificationLabel,
  currentStepIndex,
  exportedFormData
}) => {
  await storeIndexedStorageData(
    FORM_BACKUP_QUALIFICATION_LABEL_KEY,
    qualificationLabel
  )
  await storeIndexedStorageData(
    FORM_BACKUP_CURRENT_STEP_INDEX_KEY,
    currentStepIndex
  )
  await storeIndexedStorageData(FORM_BACKUP_FORM_DATA_KEY, exportedFormData)
}

export const removePaperDataBackup = async () => {
  await removeIndexedStorageData(FORM_BACKUP_QUALIFICATION_LABEL_KEY)
  await removeIndexedStorageData(FORM_BACKUP_CURRENT_STEP_INDEX_KEY)
  await removeIndexedStorageData(FORM_BACKUP_FORM_DATA_KEY)
}
