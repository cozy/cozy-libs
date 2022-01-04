import withLocales from './withLocales'

import { default as EditDocumentQualificationDefault } from './EditDocumentQualification'

import { default as ModalScannerQualificationDefault } from './ModalScannerQualification'

export { default as Scanner } from './Scanner'

export { SCANNER_DONE, SCANNER_UPLOADING } from './Scanner'
const EditDocumentQualification = withLocales(EditDocumentQualificationDefault)
const ModalScannerQualification = withLocales(ModalScannerQualificationDefault)
export { EditDocumentQualification, ModalScannerQualification }

export { getBoundT } from './locales'
