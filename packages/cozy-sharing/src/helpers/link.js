import { DOCUMENT_TYPE } from './documentType'

export const isOnlyReadOnlyLinkAllowed = ({ documentType }) =>
  documentType === DOCUMENT_TYPE.ALBUMS

export const getAppSlugFromDocumentType = ({ documentType }) => {
  switch (documentType) {
    case DOCUMENT_TYPE.ALBUMS:
      return 'photos'
    default:
      return 'drive'
  }
}
