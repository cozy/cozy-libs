import withLocales from './withLocales'

export { default as Scanner } from './Scanner'

export { SCANNER_DONE, SCANNER_UPLOADING } from './Scanner'

import { default as EditDocumentQualificationDefault } from './EditDocumentQualification'
const EditDocumentQualification = withLocales(EditDocumentQualificationDefault)

import { default as ModalScannerQualificationDefault } from './ModalScannerQualification'
const ModalScannerQualification = withLocales(ModalScannerQualificationDefault)
export { EditDocumentQualification, ModalScannerQualification }

export { getBoundT } from './locales'
