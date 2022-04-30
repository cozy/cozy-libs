import { buildFilename } from './buildFilename'

const mockSameFamilyNameContacts = [
  { _id: 'contactId01', name: { givenName: 'Bob', familyName: 'Durand' } },
  { _id: 'contactId02', name: { givenName: 'Alice', familyName: 'Durand' } }
]
const mockOneContact = [
  { _id: 'contactId01', name: { givenName: 'Bernard', familyName: 'Chabert' } }
]
const mockTwoContacts = [
  { _id: 'contactId01', name: { givenName: 'Bernard', familyName: 'Chabert' } },
  { _id: 'contactId02', name: { givenName: 'Clair', familyName: 'Guillot' } }
]
const mockThreeContacts = [
  { _id: 'contactId01', name: { givenName: 'Bernard', familyName: 'Chabert' } },
  { _id: 'contactId02', name: { givenName: 'Clair', familyName: 'Guillot' } },
  { _id: 'contactId03', name: { givenName: 'Jean', familyName: 'Rossi' } }
]

// TODO Build le nom comme "buildSubheaderName" & merger dans le commit "25efe0de6bbabb633da3a8d10c98dab5a35c97b6"

describe('buildFilename', () => {
  it('should replace "/" by "_" in qualificationName', () => {
    const paperName = buildFilename({
      contacts: [],
      qualificationName: 'passport/test'
    })

    expect(paperName).toEqual('passport_test.pdf')
  })

  it.each`
    opts | result
    ${{
  qualificationName: 'passport',
  formatedDate: '2022.01.01',
  contacts: mockOneContact,
  filenameModel: ['labelGivenByUser', 'contactName', 'featureDate'],
  metadata: { labelGivenByUser: 'Mon fichier' }
}} | ${'Mon fichier - Bernard Chabert - 2022.01.01.pdf'}
    ${{
  qualificationName: 'passport',
  formatedDate: '2022.01.01',
  contacts: [],
  filenameModel: ['labelGivenByUser', 'featureDate'],
  metadata: { labelGivenByUser: 'Mon fichier' }
}} | ${'Mon fichier - 2022.01.01.pdf'}
    ${{
  qualificationName: 'passport',
  formatedDate: '2022.01.01',
  contacts: [],
  filenameModel: ['labelGivenByUser', 'featureDate'],
  metadata: { labelGivenByUser: '' }
}} | ${'2022.01.01.pdf'}
    ${{
  qualificationName: 'passport',
  formatedDate: '2022.01.01',
  contacts: [],
  filenameModel: ['labelGivenByUser', 'featureDate']
}} | ${'2022.01.01.pdf'}
    ${{
  qualificationName: 'passport',
  formatedDate: '2022.01.01',
  contacts: [],
  filenameModel: ['labelGivenByUser', 'featureDate'],
  metadata: {}
}} | ${'2022.01.01.pdf'}
    ${{
  qualificationName: 'passport',
  contacts: []
}} | ${'passport.pdf'}
    ${{
  qualificationName: 'passport',
  contacts: [],
  pageName: 'front'
}} | ${'passport - front.pdf'}
    ${{
  qualificationName: 'passport',
  contacts: mockOneContact
}} | ${'passport - Bernard Chabert.pdf'}
    ${{
  qualificationName: 'passport',
  contacts: [],
  formatedDate: '2022.01.01'
}} | ${'passport - 2022.01.01.pdf'}
    ${{
  qualificationName: 'passport',
  pageName: 'front',
  contacts: mockOneContact
}} | ${'passport - front - Bernard Chabert.pdf'}
    ${{
  qualificationName: 'passport',
  pageName: 'front',
  contacts: [],
  formatedDate: '2022.01.01'
}} | ${'passport - front - 2022.01.01.pdf'}
    ${{
  qualificationName: 'passport',
  contacts: mockOneContact,
  formatedDate: '2022.01.01'
}} | ${'passport - Bernard Chabert - 2022.01.01.pdf'}
    ${{
  qualificationName: 'passport',
  pageName: 'front',
  contacts: mockOneContact,
  formatedDate: '2022.01.01'
}} | ${'passport - front - Bernard Chabert - 2022.01.01.pdf'}
  `(`should return $result with "$opts" parameters`, ({ opts, result }) => {
    expect(buildFilename(opts)).toEqual(result)
  })
})
