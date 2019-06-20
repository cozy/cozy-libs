import { createSlice } from 'redux-starter-kit'
import get from 'lodash/get'

import { Contact } from 'cozy-doctypes'

const personalDataSlice = createSlice({
  initialState: {
    data: {},
    loading: false,
    error: ''
  },
  slice: 'personalData',
  reducers: {
    init: (state, action) => {
      return {
        data: Object.keys(action.payload).reduce((acc, fieldId) => {
          acc[fieldId] = ''
          return acc
        }, {}),
        loading: false,
        error: ''
      }
    },
    fetchMyselfLoading: (state, action) => {
      state.loading = action.loading
    },
    fetchMyselfSuccess: (state, action) => {
      const fieldsToPopulate = Object.keys(state.data)
      const personalData = Contact.getPersonalData(
        action.payload,
        fieldsToPopulate
      )
      state.data = {
        ...state.data,
        ...personalData
      }
    },
    fetchMyselfError: (state, action) => {
      state.error = action.error
    },
    update: (state, action) => {
      state.data = {
        ...state.data,
        ...action.payload
      }
    }
  }
})

const selectors = {
  getSlice: state => get(state, personalDataSlice.slice),
  getData: state => get(state, [personalDataSlice.slice, 'data'], {})
}

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
      if (response.data) {
        dispatch(fetchMyselfSuccess(response.data[0]))
      }
    } catch (error) {
      dispatch(
        fetchMyselfError({
          error
        })
      )
    }

    dispatch(fetchMyselfLoading({ loading: false }))
  }
}

export const { getData, getSlice } = selectors

export default reducer
