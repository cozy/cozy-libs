import { Qualification } from 'cozy-client/dist/models/document'

const buildItems = labels => {
  return labels
    .map(label => {
      try {
        return new Qualification.getByLabel(label)
      } catch (e) {
        console.log('error', e) // eslint-disable-line no-console
        return null
      }
    })
    .filter(item => item)
}

const identityLabels = [
  'identity_photo',
  'national_id_card',
  'passport',
  'residence_permit',
  'electoral_card',
  'family_record_book',
  'birth_certificate',
  'driver_license',
  'citizen_registration_certificate',
  'note_identity_document',
  'other_identity_document'
]

const familyLabels = [
  'family_record_book',
  'birth_certificate',
  'wedding',
  'pacs',
  'single_parent_benefit',
  'divorce',
  'large_family_card',
  'caf',
  'payment_proof_family_allowance',
  'note_family_document',
  'other_family_document'
]

const workStudyLabels = [
  'diploma',
  'work_contract',
  'pay_sheet',
  'unemployment_benefit',
  'employment_center_certificate',
  'pension',
  'work_disability_recognition',
  'gradebook',
  'student_card',
  'school_attendance_certificate',
  'school_insurance_certificate',
  'resume',
  'motivation_letter',
  'note_work_document',
  'other_work_document'
]

const healthLabels = [
  'health_certificate',
  'health_book',
  'national_health_insurance_card',
  'national_health_insurance_right_certificate',
  'health_insurance_card',
  'prescription',
  'health_invoice',
  'work_disability_recognition',
  'pregnancy_medical_certificate',
  'note_health_document',
  'other_health_document'
]

const homeLabels = [
  'phone_invoice',
  'isp_invoice',
  'telecom_invoice',
  'energy_invoice',
  'water_invoice',
  'other_invoice',
  'work_invoice',
  'house_sale_agreeement',
  'building_permit',
  'technical_diagnostic_record',
  'unfit_for_habitation_declaration',
  'lease',
  'rent_receipt',
  'accommodation_proof',
  'house_insurance',
  'work_quote',
  'note_house_document',
  'other_house_document'
]

const transportLabels = [
  'driver_license',
  'vehicle_registration',
  'car_insurance',
  'transport_card',
  'mechanic_invoice',
  'transport_invoice',
  'note_transport_document',
  'other_transport_document'
]

const activityLabels = [
  'personal_sporting_licence',
  'fidelity_card',
  'library_card',
  'note_activity_document',
  'other_activity_document'
]

const financeLabels = [
  'tax_return',
  'tax_notice',
  'tax_timetable',
  'real_estate_tax',
  'pay_sheet',
  'receipt',
  'single_parent_benefit',
  'other_tax_document',
  'bank_details',
  'bank_statement',
  'loan_agreement',
  'payment_proof_family_allowance',
  'note_finance',
  'other_bank_document',
  'other_revenue'
]

const invoiceLabels = [
  'phone_invoice',
  'isp_invoice',
  'telecom_invoice',
  'energy_invoice',
  'water_invoice',
  'appliance_invoice',
  'web_service_invoice',
  'restaurant_invoice',
  'work_invoice',
  'transport_invoice',
  'health_invoice',
  'note_invoice',
  'other_invoice'
]

const othersLabels = ['other_administrative_document']

export const themes = [
  {
    id: 'theme1',
    label: 'identity',
    icon: 'people',
    items: buildItems(identityLabels),
    defaultItems: ['birth_certificate']
  },
  {
    id: 'theme2',
    label: 'family',
    icon: 'team',
    items: buildItems(familyLabels),
    defaultItems: ['family_record_book']
  },
  {
    id: 'theme3',
    label: 'work_study',
    icon: 'company',
    items: buildItems(workStudyLabels)
  },
  {
    id: 'theme4',
    label: 'health',
    icon: 'heart',
    items: buildItems(healthLabels)
  },
  {
    id: 'theme5',
    label: 'home',
    icon: 'home',
    items: buildItems(homeLabels)
  },
  {
    id: 'theme6',
    label: 'transport',
    icon: 'car',
    items: buildItems(transportLabels),
    defaultItems: ['driver_license']
  },
  {
    id: 'theme7',
    label: 'activity',
    icon: 'compass',
    items: buildItems(activityLabels)
  },
  {
    id: 'theme8',
    label: 'finance',
    icon: 'bank',
    items: buildItems(financeLabels)
  },
  {
    id: 'theme9',
    label: 'invoice',
    icon: 'bill',
    items: buildItems(invoiceLabels)
  },
  {
    id: 'theme10',
    label: 'others',
    icon: 'dots',
    items: buildItems(othersLabels)
  }
]
