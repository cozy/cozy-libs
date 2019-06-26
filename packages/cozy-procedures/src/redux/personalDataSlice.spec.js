import reducer, {
  init,
  update,
  fetchMyself,
  fetchMyselfLoading,
  fetchMyselfSuccess,
  fetchMyselfError,
  getData,
  getSlice,
  getCompletedFields,
  getTotalFields
} from './personalDataSlice'

describe('Personal data', () => {
  it('should init fields with undefined values', () => {
    const action = init({
      firstname: { type: 'string' },
      lastname: { type: 'string' },
      salary: { type: 'number' }
    })
    expect(reducer(undefined, action)).toEqual({
      data: {
        firstname: '',
        lastname: '',
        salary: 0
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

  it('should handle fetchMyselfLoading action', () => {
    const stateBefore = {
      data: {
        firstname: 'John',
        lastname: 'Doe'
      },
      error: '',
      loading: false
    }
    const action = fetchMyselfLoading({ loading: true })
    const expected = {
      data: {
        firstname: 'John',
        lastname: 'Doe'
      },
      error: '',
      loading: true
    }
    const stateAfter = reducer(stateBefore, action)
    expect(stateAfter).toEqual(expected)
  })

  it('should handle fetchMyselfSuccess action', () => {
    const stateBefore = {
      data: {
        firstname: 'John',
        lastname: 'Doe',
        email: ''
      },
      error: '',
      loading: false
    }
    const action = fetchMyselfSuccess({ email: 'john.doe@me.com' })
    const expected = {
      data: {
        firstname: 'John',
        lastname: 'Doe',
        email: 'john.doe@me.com'
      },
      error: '',
      loading: false
    }
    const stateAfter = reducer(stateBefore, action)
    expect(stateAfter).toEqual(expected)
  })

  it('should handle fetchMyselfError action', () => {
    const stateBefore = {
      data: {
        firstname: 'John',
        lastname: 'Doe'
      },
      error: '',
      loading: false
    }
    const action = fetchMyselfError({
      error: 'Unable to get the contact'
    })
    const expected = {
      data: {
        firstname: 'John',
        lastname: 'Doe'
      },
      error: 'Unable to get the contact',
      loading: false
    }
    const stateAfter = reducer(stateBefore, action)
    expect(stateAfter).toEqual(expected)
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
      payload: { error: 'Could not fetch myself' }
    })
    expect(dispatchSpy).toHaveBeenNthCalledWith(3, {
      type: 'personalData/fetchMyselfLoading',
      payload: { loading: false }
    })
  })

  it('should dispatch fetchMyselfSuccess with "myself" contact', async () => {
    findSpy.mockResolvedValueOnce({ data: [] })
    await fetchMyself(fakeClient)(dispatchSpy)
    expect(dispatchSpy).toHaveBeenCalled()
    expect(dispatchSpy).toHaveBeenNthCalledWith(1, {
      type: 'personalData/fetchMyselfLoading',
      payload: { loading: true }
    })
    expect(dispatchSpy).toHaveBeenNthCalledWith(2, {
      type: 'personalData/fetchMyselfLoading',
      payload: { loading: false }
    })
  })

  describe('selectors', () => {
    const state = {
      personalData: {
        data: {
          firstname: 'John',
          lastname: 'Doe',
          email: 'john.doe@me.com',
          phone: undefined,
          address: null,
          salary: ''
        }
      }
    }

    describe('getSlice', () => {
      it('should return the number of completed fields', () => {
        const result = getSlice(state)
        expect(result).toEqual({
          data: {
            firstname: 'John',
            lastname: 'Doe',
            email: 'john.doe@me.com',
            phone: undefined,
            address: null,
            salary: ''
          }
        })
      })
    })

    describe('getData', () => {
      it('should return the number of completed fields', () => {
        const result = getData(state)
        expect(result).toEqual({
          firstname: 'John',
          lastname: 'Doe',
          email: 'john.doe@me.com',
          phone: undefined,
          address: null,
          salary: ''
        })
      })
    })

    describe('getCompletedFields', () => {
      it('should return the number of completed fields', () => {
        const result = getCompletedFields(state)
        expect(result).toEqual(3)
      })
    })

    describe('getTotalFields', () => {
      it('should return the number of fields', () => {
        const result = getTotalFields(state)
        expect(result).toEqual(6)
      })
    })
  })
})
