import { filterWithRemaining } from './filterWithRemaining'

const mockObjectInArray = [
  { stepIndex: 1, model: 'scan' },
  { stepIndex: 2, model: 'information' },
  { stepIndex: 3, model: 'owner' },
  { stepIndex: 4 }
]

describe('filterWithRemaining', () => {
  it('should be return correct value with "owner" filter', () => {
    const testFunction = item => item === 'owner'
    const res = filterWithRemaining(mockObjectInArray, testFunction)

    expect(res).toStrictEqual({
      itemsFound: [{ stepIndex: 3, model: 'owner' }],
      remainingItems: [
        { stepIndex: 1, model: 'scan' },
        { stepIndex: 2, model: 'information' },
        { stepIndex: 4 }
      ]
    })
  })

  it('should be return correct value with "owner" & "scan" filter', () => {
    const testFunction = item => item === 'owner' || item === 'scan'
    const res = filterWithRemaining(mockObjectInArray, testFunction)

    expect(res).toStrictEqual({
      itemsFound: [
        { stepIndex: 1, model: 'scan' },
        { stepIndex: 3, model: 'owner' }
      ],
      remainingItems: [{ stepIndex: 2, model: 'information' }, { stepIndex: 4 }]
    })
  })

  it('should be return correct value with filter by index', () => {
    const testFunction = (_, index) => index === 1
    const res = filterWithRemaining(mockObjectInArray, testFunction)

    expect(res).toStrictEqual({
      itemsFound: [{ stepIndex: 2, model: 'information' }],
      remainingItems: [
        { stepIndex: 1, model: 'scan' },
        { stepIndex: 3, model: 'owner' },
        { stepIndex: 4 }
      ]
    })
  })
})
