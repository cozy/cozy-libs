import get from 'lodash/get'
import { createSlice } from 'redux-starter-kit'

import { AdministrativeProcedure, BankAccountStats } from 'cozy-doctypes'

import { roundCurrencyAmount } from './currency'

const personalDataSlice = createSlice({
  initialState: {
    completedFromMyself: 0,
    data: {},
    myselfLoading: false,
    bankAccountsStatsLoading: false,
    error: ''
  },
  slice: 'personalData',
  reducers: {
    init: (state, action) => {
      return {
        completedFromMyself: 0,
        data: Object.keys(action.payload).reduce((acc, fieldId) => {
          acc[fieldId] = ''
          return acc
        }, {}),
        myselfLoading: false,
        bankAccountsStatsLoading: false,
        error: ''
      }
    },
    fetchMyselfLoading: (state, action) => {
      state.myselfLoading = action.payload.loading
    },
    fetchMyselfSuccess: (state, action) => {
      const fieldsToPopulate = Object.keys(state.data)
      const personalData = AdministrativeProcedure.getPersonalData(
        action.payload,
        fieldsToPopulate
      )
      state.completedFromMyself = countCompletedFields(personalData)
      state.data = {
        ...state.data,
        ...personalData
      }
    },
    fetchMyselfError: (state, action) => {
      state.error = action.payload.error
    },
    update: (state, action) => {
      state.data = {
        ...state.data,
        ...action.payload
      }
    },
    fetchBankAccountsStatsLoading: (state, action) => {
      state.bankAccountsStatsLoading = action.payload.loading
    },
    fetchBankAccountsStatsSuccess: (state, action) => {
      if (action.payload.length === 0) {
        return
      }
      const summedStats = BankAccountStats.sum(action.payload)
      const { currency } = summedStats

      state.data = {
        ...state.data,
        salary: roundCurrencyAmount(summedStats.income, currency),
        additionalIncome: roundCurrencyAmount(
          summedStats.additionalIncome,
          currency
        ),
        propertyLoan: roundCurrencyAmount(summedStats.mortgage, currency),
        creditsTotalAmount: roundCurrencyAmount(summedStats.loans, currency),
        fixedCharges: roundCurrencyAmount(summedStats.fixedCharges, currency)
      }
    }
  }
})

const { actions, reducer } = personalDataSlice

export const {
  init,
  update,
  fetchMyselfLoading,
  fetchMyselfSuccess,
  fetchMyselfError,
  fetchBankAccountsStatsLoading,
  fetchBankAccountsStatsSuccess
} = actions

export function fetchMyself(client) {
  return async dispatch => {
    dispatch(fetchMyselfLoading({ loading: true }))
    try {
      const response = await client.collection('io.cozy.contacts').find({
        me: true
      })
      const contactSelf = get(response, 'data[0]')
      if (contactSelf) {
        dispatch(fetchMyselfSuccess(contactSelf))
      }
    } catch (error) {
      dispatch(
        fetchMyselfError({
          error: error.message
        })
      )
    }

    dispatch(fetchMyselfLoading({ loading: false }))
  }
}

export function fetchBankAccountsStats(client) {
  return async dispatch => {
    dispatch(fetchBankAccountsStatsLoading({ loading: true }))
    try {
      const query = client.all('io.cozy.bank.accounts.stats')
      const response = await client.query(query)
      dispatch(fetchBankAccountsStatsSuccess(response.data))
    } catch (error) {
      console.warn('Bank accounts stats failed to fetch', error)
    }

    dispatch(fetchBankAccountsStatsLoading({ loading: false }))
  }
}

const countCompletedFields = data =>
  Object.values(data).filter(v => v !== '').length

const getSlice = state => get(state, personalDataSlice.slice)
const getData = state => get(state, [personalDataSlice.slice, 'data'], {})
const getCompletedFromMyself = state => getSlice(state).completedFromMyself
const getCompletedFields = state => countCompletedFields(getData(state))
const getTotalFields = state => Object.keys(getData(state)).length

export {
  getData,
  getSlice,
  getCompletedFromMyself,
  getCompletedFields,
  getTotalFields
}

export default reducer
