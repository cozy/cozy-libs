import withLocales from './withLocales'

import { default as ScannerDefault } from './Scanner'
const Scanner = withLocales(ScannerDefault)

export { SCANNER_DONE, SCANNER_UPLOADING } from './Scanner'

import { default as EditDocumentQualificationDefault } from './EditDocumentQualification'
const EditDocumentQualification = withLocales(EditDocumentQualificationDefault)

import { default as ModalScannerQualificationDefault } from './ModalScannerQualification'
const ModalScannerQualification = withLocales(ModalScannerQualificationDefault)
export { Scanner, EditDocumentQualification, ModalScannerQualification }

export { getBoundT } from './locales'
