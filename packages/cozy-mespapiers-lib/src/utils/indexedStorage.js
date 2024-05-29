import localforage from 'localforage'

localforage.config({
  driver: localforage.INDEXEDDB,
  name: 'MesPapiers',
  version: 1.0,
  storeName: 'IndexedStorage'
})

// These "CREATE_PAPER_DATA_BACKUP_XXX" keys are used to restore a form
// when the Mes Papiers app is killed by the mobile
// operating system during a 'scanDocument' webview intent

// Qualification label (e.g. national_id_card) allows to
// open the CreatePaperModal with the correct paper
export const CREATE_PAPER_DATA_BACKUP_QUALIFICATION_LABEL =
  'CreatePaperDataBackup_QualificationLabel'

// Current step index (e.g. 1) allows to
// open the CreatePaperModal with the correct step
export const CREATE_PAPER_DATA_BACKUP_CURRENT_STEP_INDEX =
  'CreatePaperDataBackup_CurrentStepIndex'

// Form data allows to restore data that have been filled in the form
// (files, values, ...) before the kill by the mobile operating system
export const CREATE_PAPER_DATA_BACKUP_FORM_DATA =
  'CreatePaperDataBackup_FormData'

export const storeIndexedStorageData = async (key, value) => {
  await localforage.setItem(key, value)
}

export const getIndexedStorageData = async key => {
  const value = await localforage.getItem(key)

  return value
}

export const removeIndexedStorageData = async key => {
  await localforage.removeItem(key)
}

export const getAndRemoveIndexedStorageData = async key => {
  const value = await getIndexedStorageData(key)

  await removeIndexedStorageData(key)

  return value
}
