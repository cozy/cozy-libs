import get from 'lodash/get'

import { splitFilename, isFromKonnector } from 'cozy-client/dist/models/file'
import { KNOWN_BILLS_ATTRIBUTES_NAMES } from 'cozy-client/dist/models/paper'

/**
 * Returns file extension or class
 * @param {import("cozy-client/types").IOCozyFile} file - io.cozy.file
 * @returns {string}
 */
export const makeFormat = file => {
  const { extension } = splitFilename(file)
  return (extension.replace('.', '') || file.class).toUpperCase()
}

/**
 * Returns a formatted date
 * @param {string} lang - language in ISO 639-1 format
 * @returns {string}
 */
export const makeDate = lang =>
  lang === 'fr' ? 'DD MMM YYYY à HH:mm' : 'MMM DD YYYY at HH:mm'

/**
 * Returns a formatted size
 * @param {number} bytes - file bytes
 * @returns {string}
 */
export const makeSize = bytes => {
  if (!+bytes) return '0'

  const k = 1024
  const dm = 2
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

/**
 * Returns file path
 * @param {import("cozy-client/types").IOCozyFile} file - io.cozy.file
 * @returns {string}
 */
export const makePath = file => file.path?.replace(`/${file.name}`, '')

/**
 *
 * @param {array} formattedMetadataQualification
 * @param {number} idx
 * @returns {boolean}
 */
export const makeHideDivider = (formattedMetadataQualification, idx) => {
  const lastItem = formattedMetadataQualification.at(-1)
  const isLastItem = idx === formattedMetadataQualification.length - 1
  const isSecondLastItem = idx === formattedMetadataQualification.length - 2
  const hideDivider =
    isLastItem || (isSecondLastItem && lastItem.name === 'contact')

  return hideDivider
}

// should be in cozy-client when all test and adjustment are done
export const metadataByQualificationLabel = {
  accommodation_proof: ['issueDate'],
  bank_details: ['number', 'bicNumber'],
  bank_statement: ['referencedDate'],
  birth_certificate: [],
  caf: ['number', 'issueDate'],
  car_insurance: [],
  condition_report: ['date'],
  diploma: ['referencedDate'],
  divorce: [],
  driver_license: [
    'number',
    'country',
    'AObtentionDate',
    'BObtentionDate',
    'CObtentionDate',
    'DObtentionDate',
    'expirationDate',
    'noticePeriod'
  ],
  electoral_card: ['referencedDate'],
  employment_center_certificate: ['referencedDate'],
  energy_invoice: ['issueDate'],
  expense_claim: ['referencedDate'],
  family_record_book: [],
  fidelity_card: ['number', 'expirationDate', 'noticePeriod'],
  health_certificate: ['referencedDate'],
  health_insurance_card: ['expirationDate', 'noticePeriod'],
  house_insurance: ['referencedDate'],
  identity_photo: ['shootingDate'],
  isp_invoice: ['issueDate'],
  lease: ['date'],
  loan_agreement: ['issueDate'],
  national_health_insurance_card: ['number', 'issueDate'],
  national_health_insurance_right_certificate: ['referencedDate'],
  national_id_card: ['number', 'country', 'expirationDate', 'noticePeriod'],
  note_activity_document: [],
  note_family_document: [],
  note_finance: [],
  note_health_document: [],
  note_house_document: [],
  note_identity_document: [],
  note_invoice: [],
  note_transport_document: [],
  note_work_document: [],
  other_activity_document: ['date'],
  other_administrative_document: ['referencedDate'],
  other_bank_document: ['date'],
  other_family_document: ['date'],
  other_health_document: ['date'],
  other_house_document: ['date'],
  other_identity_document: ['date'],
  other_invoice: ['issueDate'],
  other_revenue: ['referencedDate'],
  other_transport_document: ['date'],
  other_work_document: ['date'],
  pacs: ['referencedDate'],
  passport: ['country', 'number', 'expirationDate', 'noticePeriod'],
  pay_sheet: ['number', 'netSocialAmount', 'employerName', 'referencedDate'],
  payment_proof_family_allowance: ['number', 'issueDate'],
  phone_invoice: ['issueDate'],
  pregnancy_medical_certificate: ['referencedDate'],
  prescription: ['referencedDate'],
  real_estate_tax: ['number', 'referencedDate'],
  rent_receipt: ['referencedDate'],
  residence_permit: ['country', 'number', 'expirationDate', 'noticePeriod'],
  resume: ['referencedDate'],
  school_attendance_certificate: ['referencedDate'],
  school_insurance_certificate: ['referencedDate'],
  single_parent_benefit: ['referencedDate'],
  student_card: ['referencedDate'],
  tax_certificate: ['referencedDate'],
  tax_notice: ['number', 'refTaxIncome', 'referencedDate'],
  tax_return: ['number', 'referencedDate'],
  tax_timetable: ['number', 'referencedDate'],
  transport_card: ['expirationDate', 'noticePeriod'],
  transport_invoice: ['issueDate'],
  unemployment_benefit: ['referencedDate'],
  unfit_for_habitation_declaration: ['issueDate'],
  vehicle_registration: [
    'vehicle.licenseNumber',
    'number',
    'vehicle.confidentialNumber'
  ],
  water_invoice: ['issueDate'],
  work_contract: ['contractType', 'date'],
  work_disability_recognition: ['referencedDate'],
  work_quote: []
}

/**
 *
 * @param {import("cozy-client/types").IOCozyFile} file - io.cozy.file
 * @returns {array}
 */
export const makeFormattedMetadataQualification = file => {
  const qualification = file.metadata?.qualification?.label
  const relatedBills = file.bills?.data?.[0]

  if (!qualification) return []

  const metadata = metadataByQualificationLabel[qualification]

  const metadataArray = metadata
    ? metadata.reduce((acc, el) => {
        acc.push({ name: el, value: get(file, `metadata.${el}`) })

        return acc
      }, [])
    : []

  const billsMetadataArray = relatedBills
    ? KNOWN_BILLS_ATTRIBUTES_NAMES.map(attrName => ({
        name: attrName,
        value: relatedBills[attrName]
      }))
    : []

  return metadataArray
    .concat(billsMetadataArray)
    .concat([{ name: 'contact', value: null }])
}

/**
 *
 * @param {import("cozy-client/types").IOCozyFile} file - io.cozy.file
 * @returns {boolean}
 */
export const isExpirationAlertHidden = file => {
  return file?.metadata?.hideExpirationAlert ?? false
}

/**
 *
 * @param {import("cozy-client/types").IOCozyFile} file - io.cozy.file
 * @param {boolean} isReadOnly - Is sharing read-only
 * @returns {boolean}
 */
export const canEditQualification = (file, isReadOnly) =>
  !isFromKonnector(file) && !isReadOnly
