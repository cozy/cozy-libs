import { createSlice } from 'redux-starter-kit'
import get from 'lodash/get'

import { AdministrativeProcedure } from 'cozy-doctypes'

const personalDataSlice = createSlice({
  initialState: {
    completedFromMyself: 0,
    data: {},
    loading: false,
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
        loading: false,
        error: ''
      }
    },
    fetchMyselfLoading: (state, action) => {
      state.loading = action.payload.loading
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
    }
  }
})

const { actions, reducer } = personalDataSlice

export const {
  init,
  update,
  fetchMyselfLoading,
  fetchMyselfSuccess,
  fetchMyselfError
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
