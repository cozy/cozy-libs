import reducer, { init, update } from './personalDataSlice'

describe('Personal data', () => {
  it('should init fields with undefined values', () => {
    const action = init({
      firstname: {},
      lastname: {}
    })
    expect(reducer(undefined, action)).toEqual({
      data: {
        firstname: '',
        lastname: ''
      },
      loading: false,
      error: ''
    })
  })

  it('should update fields with new values', () => {
    const stateBefore = {
      data: {
        firstname: 'John',
        lastname: 'Doe'
      },
      error: '',
      loading: false
    }
    const action = update({
      firstname: 'Jane',
      lastname: 'Doe'
    })
    const expectedState = {
      data: {
        firstname: 'Jane',
        lastname: 'Doe'
      },
      error: '',
      loading: false
    }
    expect(reducer(stateBefore, action)).toEqual(expectedState)
  })
})
