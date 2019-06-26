import { createSlice } from 'redux-starter-kit'
import get from 'lodash/get'

import { AdministrativeProcedure } from 'cozy-doctypes'

function getDefaultValue(field) {
  const typeValueMapping = {
    string: '',
    number: 0
  }

  return get(typeValueMapping, field.type, undefined)
}

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
          acc[fieldId] = getDefaultValue(action.payload[fieldId])
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
          error
        })
      )
    }

    dispatch(fetchMyselfLoading({ loading: false }))
  }
}

const getSlice = state => get(state, personalDataSlice.slice)
const getData = state => get(state, [personalDataSlice.slice, 'data'], {})
const getCompletedFields = state =>
  Object.values(getData(state)).filter(Boolean).length
const getTotalFields = state => Object.keys(getData(state)).length

export { getData, getSlice, getCompletedFields, getTotalFields }

export default reducer
