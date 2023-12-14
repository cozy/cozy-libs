import { makeReferenceRulesByOcrAttributes } from './makeReferenceRulesByOcrAttributes'

describe('getReferenceRulesByOcrAttributes', () => {
  it('should return reference rules with side attribute', () => {
    const ocrAttributes = {
      front: {
        referenceRules: [{ regex: 'rule1' }, { regex: 'rule2' }]
      },
      back: {
        referenceRules: [{ regex: 'rule3' }, { regex: 'rule4' }]
      }
    }

    const expected = [
      { regex: 'rule1', side: 'front' },
      { regex: 'rule2', side: 'front' },
      { regex: 'rule3', side: 'back' },
      { regex: 'rule4', side: 'back' }
    ]

    expect(makeReferenceRulesByOcrAttributes(ocrAttributes)).toEqual(expected)
  })

  it('should return an empty array if no front or back attributes', () => {
    const ocrAttributes = {
      other: {
        referenceRules: [{ regex: 'rule1' }, { regex: 'rule2' }]
      }
    }

    expect(makeReferenceRulesByOcrAttributes(ocrAttributes)).toEqual([])
  })

  it('should return an empty array if referenceRules is not found', () => {
    const ocrAttributes = {
      front: {
        otherAttribute: 'other value'
      }
    }

    expect(makeReferenceRulesByOcrAttributes(ocrAttributes)).toEqual([])
  })
})
