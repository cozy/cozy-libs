import reducer, {
  init,
  update,
  fetchMyself,
  fetchMyselfLoading,
  fetchMyselfSuccess,
  fetchBankAccountsStatsSuccess,
  fetchMyselfError,
  getData,
  getSlice,
  getCompletedFromMyself,
  getCompletedFields,
  getTotalFields,
  fetchBankAccountsStats
} from './personalDataSlice'
const stateBefore = {
  data: {
    firstname: '',
    lastname: '',
    email: ''
  },
  error: '',
  myselfLoading: false,
  bankAccountsStatsLoading: false
}

describe('Personal data', () => {
  it('should init fields with undefined values', () => {
    const action = init({
      firstname: { type: 'string' },
      lastname: { type: 'string' },
      salary: { type: 'number' }
    })
    expect(reducer(undefined, action)).toEqual({
      completedFromMyself: 0,
      data: {
        firstname: '',
        lastname: '',
        salary: ''
      },
      myselfLoading: false,
      bankAccountsStatsLoading: false,
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
      myselfLoading: false,
      bankAccountsStatsLoading: false
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
      myselfLoading: false,
      bankAccountsStatsLoading: false
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
      myselfLoading: false
    }
    const action = fetchMyselfLoading({ loading: true })
    const expected = {
      data: {
        firstname: 'John',
        lastname: 'Doe'
      },
      error: '',
      myselfLoading: true
    }
    const stateAfter = reducer(stateBefore, action)
    expect(stateAfter).toEqual(expected)
  })

  it('should handle fetchMyselfSuccess action', () => {
    const stateBefore = {
      completedFromMyself: 0,
      data: {
        firstname: '',
        lastname: '',
        email: ''
      },
      error: '',
      myselfLoading: false
    }
    const action = fetchMyselfSuccess({
      name: { givenName: 'John', familyName: 'Doe' },
      email: 'john.doe@me.com'
    })
    const expected = {
      completedFromMyself: 3,
      data: {
        firstname: 'John',
        lastname: 'Doe',
        email: 'john.doe@me.com'
      },
      error: '',
      myselfLoading: false
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
      myselfLoading: false
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
      myselfLoading: false
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
        completedFromMyself: 2,
        data: {
          firstname: 'John',
          lastname: 'Doe',
          email: 'john.doe@me.com',
          phone: '',
          address: '',
          salary: 0
        }
      }
    }

    describe('getSlice', () => {
      it('should return the number of completed fields', () => {
        const result = getSlice(state)
        expect(result).toEqual({
          completedFromMyself: 2,
          data: {
            firstname: 'John',
            lastname: 'Doe',
            email: 'john.doe@me.com',
            phone: '',
            address: '',
            salary: 0
          }
        })
      })
    })

    describe('getData', () => {
      it('should return the data', () => {
        const result = getData(state)
        expect(result).toEqual({
          firstname: 'John',
          lastname: 'Doe',
          email: 'john.doe@me.com',
          phone: '',
          address: '',
          salary: 0
        })
      })
    })

    describe('getCompletedFromMyself', () => {
      it('should return the number of fields that have been completed by the app', () => {
        const result = getCompletedFromMyself(state)
        expect(result).toEqual(2)
      })
    })

    describe('getCompletedFields', () => {
      it('should return the number of completed fields', () => {
        const result = getCompletedFields(state)
        expect(result).toEqual(4)
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

describe('fetchBankAccountsStats action', () => {
  const findSpy = jest.fn()
  const fakeClient = {
    query: findSpy,
    all: jest.fn()
  }
  const dispatchSpy = jest.fn()
  const accountsStats = [
    {
      income: 2000,
      additionalIncome: 400,
      mortgage: 650,
      loans: 800
    },
    {
      income: 1500,
      additionalIncome: 0,
      mortgage: 0,
      loans: 0
    }
  ]

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should handle fetchBankAccountsStatsSuccess action (no stats)', () => {
    const action = fetchBankAccountsStatsSuccess([])
    const expected = stateBefore
    const stateAfter = reducer(stateBefore, action)
    expect(stateAfter).toEqual(expected)
  })

  it('should handle fetchBankAccountsStatsSuccess action (some stats)', () => {
    const action = fetchBankAccountsStatsSuccess(accountsStats)
    const expected = {
      data: {
        additionalIncome: 400,
        creditsTotalAmount: 800,
        propertyLoan: 650,
        salary: 3500
      }
    }
    const stateAfter = reducer(stateBefore, action)
    expect(stateAfter).toMatchObject(expected)
  })

  it('should dispatch fetchBankAccountsStatsSuccess with bank accounts stats', async () => {
    findSpy.mockResolvedValueOnce({ data: accountsStats })
    await fetchBankAccountsStats(fakeClient)(dispatchSpy)
    expect(dispatchSpy).toHaveBeenCalled()
    expect(dispatchSpy).toHaveBeenNthCalledWith(1, {
      type: 'personalData/fetchBankAccountsStatsLoading',
      payload: { loading: true }
    })
    expect(dispatchSpy).toHaveBeenNthCalledWith(2, {
      type: 'personalData/fetchBankAccountsStatsSuccess',
      payload: accountsStats
    })
    expect(dispatchSpy).toHaveBeenNthCalledWith(3, {
      type: 'personalData/fetchBankAccountsStatsLoading',
      payload: { loading: false }
    })
  })
})
