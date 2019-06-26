/*eslint no-unused-vars: off*/
/*eslint no-console: off*/
import { createSlice } from 'redux-starter-kit'
import get from 'lodash/get'
import creditApplicationTemplate from '../templates/creditApplicationTemplate'
import { AdministrativeProcedure } from 'cozy-doctypes'

const documentsSlice = createSlice({
  initialState: {
    data: {
      /*  payslip: {
        ...files
      } */
    },
    ui: {
      /* payslip: {
        loading: true,
        error: false
      } */
    }
  },
  slice: 'documents',
  reducers: {
    init: (state, action) => {
      return {
        data: Object.keys(action.payload).reduce((acc, fieldId) => {
          acc[fieldId] = {}
          return acc
        }, {}),
        ui: Object.keys(action.payload).reduce((acc, fieldId) => {
          acc[fieldId] = {
            loading: false,
            error: false
          }
          return acc
        }, {})
      }
    },
    update: (state, action) => {
      console.warn('update documents slice not implemented')
      return state
    },
    fetchDocumentLoading: (state, action) => {
      const { idDoctemplate, loading } = action.payload
      state.ui[idDoctemplate].loading = loading
    },
    fetchDocumentSuccess: (state, action) => {
      const { idDoctemplate, loading, files } = action.payload
      state.ui[idDoctemplate].loading = loading
      state.data[idDoctemplate].documents = files
    },
    fetchDocumentError: (state, action) => {
      const { idDoctemplate, error } = action.payload
      state.ui[idDoctemplate].error = error
    }
  }
})
const selectors = {
  getDocuments: state => get(state, [documentsSlice.slice, 'data'], {})
}

const { actions, reducer } = documentsSlice
export const {
  init,
  update,
  fetchDocumentLoading,
  fetchDocumentSuccess,
  fetchDocumentError
} = actions

export function fetchDocument(client, documentTemplate) {
  return async dispatch => {
    dispatch(
      fetchDocumentLoading({
        loading: true,
        idDoctemplate: documentTemplate
      })
    )
    try {
      const docWithRules = creditApplicationTemplate.documents[documentTemplate]

      /**
       *TODO : We need to work on the `count`
       */

      const files = await AdministrativeProcedure.getFilesByRules(docWithRules)

      //const files = {}
      if (files.data) {
        dispatch(
          fetchDocumentSuccess({
            loading: false,
            files: files.data,
            idDoctemplate: documentTemplate
          })
        )
      }
    } catch (error) {
      dispatch(
        fetchDocumentError({
          error: error.message,
          idDoctemplate: documentTemplate
        })
      )
    }
    dispatch(
      fetchDocumentLoading({
        loading: false,
        idDoctemplate: documentTemplate
      })
    )
  }
}

export const { getDocuments } = selectors
export default reducer
