import { findAttributes, findPaperVersion } from './findAttributes'

/*
Nom : John Doe
adresse : 100 avenue philippe leclerc
banque : 12345
guichet : 23456
bic : ABCDEFGH
iban : FR00 1234 2345 3456 4567 5678 678
agence de domiciliation : PARIS EST, 1 rue du marechal leclerc, 75000 PARIS
 */

describe('findAttributes', () => {
  it('should find attributes by regex', () => {
    const OCRResult = [
      {
        lines: [
          {
            elements: [],
            cornerPoints: [],
            text: 'John Doe',
            bounding: {
              height: 20,
              width: 100,
              left: 10,
              top: 10
            }
          }
        ],
        text: 'John Doe',
        bounding: {
          x: 10,
          y: 10,
          width: 100,
          height: 20
        }
      },
      {
        lines: [
          {
            elements: [],
            cornerPoints: [],
            text: '123 Main St',
            bounding: {
              height: 20,
              width: 100,
              left: 10,
              top: 40
            }
          }
        ],
        text: '123 Main St',
        bounding: {
          x: 10,
          y: 40,
          width: 100,
          height: 20
        }
      }
    ]
    const imgSize = {
      width: 200,
      height: 200
    }
    const attributes = {
      attributesRegex: [
        {
          name: 'name',
          regex: 'John Doe',
          oneWord: true
        },
        {
          name: 'address',
          regex: '123 Main St',
          oneWord: true
        }
      ]
    }
    const expected = {
      attributes: [
        {
          name: 'name',
          value: 'John Doe'
        },
        {
          name: 'address',
          value: '123 Main St'
        }
      ]
    }
    const result = findAttributes(OCRResult, imgSize, attributes)
    expect(result).toEqual(expected)
  })
})

describe('findPaperVersion', () => {
  const OCRIdentityCardFront = [
    {
      lines: [
        {
          text: "CARTE NATIONALE D'IDENTITÉ",
          elements: [
            {
              text: 'CARTE'
            },
            {
              text: 'NATIONALE'
            },
            {
              text: "D'IDENTITE"
            }
          ]
        }
      ]
    },
    {
      lines: [
        {
          text: 'IDFRAJOHN<<DOE<<<<<<<081121',
          elements: [
            {
              text: 'IDFRAJOHN<<DOE<<<<<<<081121'
            }
          ]
        }
      ]
    }
  ]
  const OCRIdentityCardBack = [
    {
      lines: [
        {
          text: 'Adresse : ',
          elements: [
            {
              text: 'Adresse'
            },
            {
              text: ':'
            }
          ]
        }
      ]
    }
  ]
  const OCR = {
    front: { OCRResult: OCRIdentityCardFront },
    back: { OCRResult: OCRIdentityCardBack }
  }

  it('should not find the version when nothing match', () => {
    const versionReferences = [
      {
        version: '2023.03',
        referenceRules: [
          {
            regex: 'IDDY',
            side: 'front'
          }
        ]
      },
      {
        version: '1995.12',
        referenceRules: [
          {
            regex: 'CARTY',
            side: 'back'
          }
        ]
      }
    ]

    expect(findPaperVersion(OCR, versionReferences)).toEqual({
      version: null
    })
  })
  it('should find the correct paper version with front and back rules', () => {
    const versionReferences = [
      {
        version: '2023.03',
        referenceRules: [
          {
            regex: 'CARTENATIONALEDIDENTITE',
            side: 'front'
          },
          {
            regex: 'REPUBLIQUE',
            side: 'back'
          }
        ]
      },
      {
        version: '1995.12',
        referenceRules: [
          {
            regex: 'CARTENATIONALEDIDENTITE',
            side: 'front'
          },
          {
            regex: '^IDFRA',
            side: 'front'
          },
          {
            regex: 'ADRESSE',
            side: 'back'
          }
        ]
      }
    ]
    expect(findPaperVersion(OCR, versionReferences)).toEqual({
      version: '1995.12'
    })
  })
  it('should find the correct paper version when only front rules', () => {
    const versionReferences = [
      {
        version: '1995.12',
        referenceRules: [
          {
            regex: 'CARTENATIONALEDIDENTITE',
            side: 'front'
          },
          {
            regex: '^IDFRA',
            side: 'front'
          }
        ]
      }
    ]
    expect(findPaperVersion(OCR, versionReferences)).toEqual({
      version: '1995.12'
    })
  })
  it('should find the correct paper version when only back rules', () => {
    const versionReferences = [
      {
        version: '1995.12',
        referenceRules: [
          {
            regex: 'ADRESSE',
            side: 'back'
          }
        ]
      }
    ]
    expect(findPaperVersion(OCR, versionReferences)).toEqual({
      version: '1995.12'
    })
  })
})
