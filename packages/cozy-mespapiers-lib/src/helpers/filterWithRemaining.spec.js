import { filterWithRemaining } from './filterWithRemaining'

const mockObjectInArray = [
  { model: 'scan' },
  { model: 'information' },
  { model: 'owner' }
]

describe('filterWithRemaining', () => {
  it('should be return correct value with "owner" filter', () => {
    const testFunction = item => item === 'owner'
    const res = filterWithRemaining(mockObjectInArray, testFunction)

    expect(res).toStrictEqual({
      itemsFound: [{ model: 'owner' }],
      remainingItems: [{ model: 'scan' }, { model: 'information' }]
    })
  })

  it('should be return correct value with "owner" & "scan" filter', () => {
    const testFunction = item => item === 'owner' || item === 'scan'
    const res = filterWithRemaining(mockObjectInArray, testFunction)

    expect(res).toStrictEqual({
      itemsFound: [{ model: 'scan' }, { model: 'owner' }],
      remainingItems: [{ model: 'information' }]
    })
  })

  it('should be return correct value with filter by index', () => {
    const testFunction = (_, index) => index === 1
    const res = filterWithRemaining(mockObjectInArray, testFunction)

    expect(res).toStrictEqual({
      itemsFound: [{ model: 'information' }],
      remainingItems: [{ model: 'scan' }, { model: 'owner' }]
    })
  })
})
