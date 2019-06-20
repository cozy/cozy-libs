/*eslint no-unused-vars: off*/
/*eslint no-console: off*/
import { createSlice } from 'redux-starter-kit'
import get from 'lodash/get'
import creditApplicationTemplate from '../templates/creditApplicationTemplate'

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
      const { idDoctemplate, loading, file } = action.payload
      state.ui[idDoctemplate].loading = loading
      state.data[idDoctemplate].document = file
    },
    fetchDocumentError: (state, action) => {
      const { idDoctemplate, error } = action.payload
      state.ui[idDoctemplate].error = error
    }
  }
})
const selectors = {
  getSlice: state => get(state, documentsSlice.slice)
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
      /* const docWithRules =
          creditApplicationTemplate.documents[documentTemplate]
        
        //Ajout du metadata.
        // Ajout du order by
        const cozyRules = {
          trashed: false,
          type: 'file',
          ...docWithRules.rules
        }
        const files = await client.collection('io.cozy.files').find(cozyRules)

        console.log('files', files) */

      const files = {}
      if (files.data) {
        dispatch(
          fetchDocumentSuccess({
            loading: false,
            file: files.data[0],
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

export const { getSlice } = selectors
export default reducer
