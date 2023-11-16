import { findAttributes } from './findAttributes'

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
