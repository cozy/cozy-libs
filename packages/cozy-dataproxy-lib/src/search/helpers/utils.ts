import flag from 'cozy-flags'

import { FILES_DOCTYPE, SHARED_DRIVE_FILES_DOCTYPE } from '../consts'

export const isDebug = (): boolean => {
  return Boolean(flag('debug'))
}

export const normalizeDoctype = (doctype: string): string => {
  if (doctype && doctype.includes(SHARED_DRIVE_FILES_DOCTYPE)) {
    return FILES_DOCTYPE
  }

  return doctype
}
