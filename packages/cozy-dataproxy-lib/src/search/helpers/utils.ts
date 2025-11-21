import flag from 'cozy-flags'

import {
  FILES_DOCTYPE,
  SHARED_DRIVE_FILES_DOCTYPE,
  SearchedDoctype
} from '../consts'
import { isSearchedDoctype } from '../types'

export const isDebug = (): boolean => {
  return Boolean(flag('debug'))
}

export const normalizeDoctype = (
  doctype: string | undefined
): SearchedDoctype => {
  if (doctype && doctype.includes(SHARED_DRIVE_FILES_DOCTYPE)) {
    return FILES_DOCTYPE as SearchedDoctype
  }
  // Only return the doctype if it's a valid SearchedDoctype
  if (isSearchedDoctype(doctype)) {
    return doctype as SearchedDoctype
  }
  // Fallback to FILES_DOCTYPE for unknown doctypes
  return FILES_DOCTYPE as SearchedDoctype
}
