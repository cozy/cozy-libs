import reducer, { init, update, fetchMyself } from './personalDataSlice'

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

describe('fetchMyself action', () => {
  const findSpy = jest.fn()
  const fakeClient = {
    collection: () => ({
      find: findSpy
    })
  }
  const dispatchSpy = jest.fn()
  const contact = {
    id: '123',
    name: { givenName: 'Arya', familyName: 'Stark ' }
  }

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should dispatch fetchMyselfSuccess with "myself" contact', async () => {
    findSpy.mockResolvedValueOnce({ data: [contact] })
    await fetchMyself(fakeClient)(dispatchSpy)
    expect(dispatchSpy).toHaveBeenCalled()
    expect(dispatchSpy).toHaveBeenNthCalledWith(1, {
      type: 'personalData/fetchMyselfLoading',
      payload: { loading: true }
    })
    expect(dispatchSpy).toHaveBeenNthCalledWith(2, {
      type: 'personalData/fetchMyselfSuccess',
      payload: { id: '123', name: { givenName: 'Arya', familyName: 'Stark ' } }
    })
    expect(dispatchSpy).toHaveBeenNthCalledWith(3, {
      type: 'personalData/fetchMyselfLoading',
      payload: { loading: false }
    })
  })

  it('should dispatch fetchMyselfError if there is an error', async () => {
    findSpy.mockRejectedValue({
      message: 'Could not fetch myself'
    })
    await fetchMyself(fakeClient)(dispatchSpy)
    expect(dispatchSpy).toHaveBeenCalled()
    expect(dispatchSpy).toHaveBeenNthCalledWith(1, {
      type: 'personalData/fetchMyselfLoading',
      payload: { loading: true }
    })
    expect(dispatchSpy).toHaveBeenNthCalledWith(2, {
      type: 'personalData/fetchMyselfError',
      payload: { error: { message: 'Could not fetch myself' } }
    })
    expect(dispatchSpy).toHaveBeenNthCalledWith(3, {
      type: 'personalData/fetchMyselfLoading',
      payload: { loading: false }
    })
  })
})
