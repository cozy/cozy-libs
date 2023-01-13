import { DOCUMENT_TYPE } from './documentType'

export const isOnlyReadOnlyLinkAllowed = ({ documentType }) =>
  documentType === DOCUMENT_TYPE.ALBUMS
