import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import {
  getAndRemoveIndexedStorageData,
  FORM_BACKUP_QUALIFICATION_LABEL_KEY
} from '../utils/indexedStorage'

const CreatePaperDataBackupRoute = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const restoreCreatePaperDataBackupIfNeeded = async () => {
      const formBackupQualificationLabel = await getAndRemoveIndexedStorageData(
        FORM_BACKUP_QUALIFICATION_LABEL_KEY
      )

      if (formBackupQualificationLabel) {
        navigate(`/paper/create/${formBackupQualificationLabel}`)
      }
    }

    restoreCreatePaperDataBackupIfNeeded()
  }, [navigate])

  return <Outlet />
}

export default CreatePaperDataBackupRoute
