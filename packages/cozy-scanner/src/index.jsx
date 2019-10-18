import withLocales from './withLocales'

import { default as ScannerDefault } from './Scanner'
const Scanner = withLocales(ScannerDefault)

export { SCANNER_DONE, SCANNER_UPLOADING } from './Scanner'

import { default as EditDocumentQualificationDefault } from './EditDocumentQualification'
const EditDocumentQualification = withLocales(EditDocumentQualificationDefault)

import { default as ScannerQualificationDefault } from './ScannerQualification'
const ScannerQualification = withLocales(ScannerQualificationDefault)
export { Scanner, EditDocumentQualification, ScannerQualification }
