import reducer, { init, update } from './personalDataSlice'

describe('Personal data', () => {
  it('should init fields with undefind values', () => {
    const action = init({
      firstname: {},
      lastname: {}
    })
    expect(reducer(undefined, action)).toEqual({
      firstname: undefined,
      lastname: undefined
    })
  })

  it('should update fields with new values', () => {
    const action = update({
      firstname: 'Le',
      lastname: 'Chiffre'
    })
    expect(reducer(undefined, action)).toEqual({
      firstname: 'Le',
      lastname: 'Chiffre'
    })
  })
})
