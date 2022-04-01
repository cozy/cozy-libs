import { buildFilename } from 'src/helpers/buildFilename'

describe('buildFilename', () => {
  it('should replace "/" by "_" in qualificationName', () => {
    const paperName = buildFilename({
      qualificationName: 'passport/test'
    })

    expect(paperName).toEqual('passport_test.pdf')
  })

  it.each`
    opts | result
    ${{
  qualificationName: 'passport',
  formatedDate: '2022.01.01',
  contactName: 'Bob',
  filenameModel: ['labelGivenByUser', 'contactName', 'featureDate'],
  metadata: { labelGivenByUser: 'Mon fichier' }
}} | ${'Mon fichier - Bob - 2022.01.01.pdf'}
    ${{
  qualificationName: 'passport',
  formatedDate: '2022.01.01',
  filenameModel: ['labelGivenByUser', 'featureDate'],
  metadata: { labelGivenByUser: 'Mon fichier' }
}} | ${'Mon fichier - 2022.01.01.pdf'}
    ${{
  qualificationName: 'passport',
  formatedDate: '2022.01.01',
  filenameModel: ['labelGivenByUser', 'featureDate'],
  metadata: { labelGivenByUser: '' }
}} | ${'2022.01.01.pdf'}
    ${{
  qualificationName: 'passport',
  formatedDate: '2022.01.01',
  filenameModel: ['labelGivenByUser', 'featureDate']
}} | ${'2022.01.01.pdf'}
    ${{
  qualificationName: 'passport',
  formatedDate: '2022.01.01',
  filenameModel: ['labelGivenByUser', 'featureDate'],
  metadata: {}
}} | ${'2022.01.01.pdf'}
    ${{
  qualificationName: 'passport'
}} | ${'passport.pdf'}
    ${{
  qualificationName: 'passport',
  pageName: 'front'
}} | ${'passport - front.pdf'}
    ${{
  qualificationName: 'passport',
  contactName: 'Bob'
}} | ${'passport - Bob.pdf'}
    ${{
  qualificationName: 'passport',
  formatedDate: '2022.01.01'
}} | ${'passport - 2022.01.01.pdf'}
    ${{
  qualificationName: 'passport',
  pageName: 'front',
  contactName: 'Bob'
}} | ${'passport - front - Bob.pdf'}
    ${{
  qualificationName: 'passport',
  pageName: 'front',
  formatedDate: '2022.01.01'
}} | ${'passport - front - 2022.01.01.pdf'}
    ${{
  qualificationName: 'passport',
  contactName: 'Bob',
  formatedDate: '2022.01.01'
}} | ${'passport - Bob - 2022.01.01.pdf'}
    ${{
  qualificationName: 'passport',
  pageName: 'front',
  contactName: 'Bob',
  formatedDate: '2022.01.01'
}} | ${'passport - front - Bob - 2022.01.01.pdf'}
  `(`should return $result with "$opts" parameters`, ({ opts, result }) => {
    expect(buildFilename(opts)).toEqual(result)
  })
})
