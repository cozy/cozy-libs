import get from 'lodash/get'
import { createSlice } from 'redux-starter-kit'

import { models } from 'cozy-client'
import { creditApplicationTemplate } from 'cozy-procedures'
const { fetchFilesByQualificationRules } = models.file

const documentsSlice = createSlice({
  initialState: {
    completedFromDrive: 0,
    data: {
      /*  payslip: {
        files: []
      } */
    },
    ui: {
      /* payslip: [
        {

        },
        {

        }
      ] */
    }
  },
  slice: 'documents',
  reducers: {
    init: (state, action) => {
      return {
        completedFromDrive: 0,
        data: Object.keys(action.payload).reduce((acc, fieldId) => {
          // init files with undefined value
          acc[fieldId] = {
            files: Array.from(Array(action.payload[fieldId].count))
          }
          return acc
        }, {}),
        ui: Object.keys(action.payload).reduce(
          (acc, fieldId) => {
            const count = action.payload[fieldId].count
            acc[fieldId] = Array.from(Array(count))
            for (let i = 0; i < count; i++) {
              acc[fieldId][i] = {
                loading: false,
                error: false
              }
            }

            return acc
          },
          {
            initiated: false
          }
        )
      }
    },

    setDocumentLoading: (state, action) => {
      const { idDoctemplate, index } = action.payload
      state.ui[idDoctemplate][index].loading = true
    },
    fetchDocumentSuccess: (state, action) => {
      const { idDoctemplate, file, index } = action.payload
      state.ui[idDoctemplate][index].loading = false
      state.data[idDoctemplate].files[index] = file
      state.completedFromDrive += 1
    },
    fetchDocumentError: (state, action) => {
      const { idDoctemplate, error, index } = action.payload
      state.ui[idDoctemplate][index].error = error
      state.ui[idDoctemplate][index].loading = false
    },
    unlinkDocument: (state, action) => {
      const { categoryId, index } = action.payload
      state.data[categoryId].files[index] = undefined
    },
    linkDocumentSuccess: (state, action) => {
      const { document, categoryId, index } = action.payload
      state.data[categoryId].files[index] = document
    },
    setLoadingFalse: (state, action) => {
      const { idDoctemplate, index } = action.payload
      state.ui[idDoctemplate][index].loading = false
    }
  }
})

const getData = state => get(state, [documentsSlice.slice, 'data'], {})

const getCompletedCount = state =>
  Object.values(getData(state)).reduce((acc, { files }) => {
    files.map(file => {
      if (file !== undefined) {
        acc++
      }
    })
    return acc
  }, 0)

const selectors = {
  getFiles: getData,
  getCompletedFromDrive: state =>
    get(state, [documentsSlice.slice, 'completedFromDrive'], 0),
  getCompletedDocumentsCount: getCompletedCount,
  getDocumentsTotal: () => {
    // FIXME: don't use the template directly here
    return Object.values(creditApplicationTemplate.documents).reduce(
      (acc, { count }) => acc + count,
      0
    )
  },

  getFilesStatus: state => get(state, [documentsSlice.slice, 'ui'], {})
}

const { actions, reducer } = documentsSlice
export const {
  init,
  update,
  setDocumentLoading,
  fetchDocumentSuccess,
  fetchDocumentError,
  unlinkDocument,
  linkDocumentSuccess,
  setLoadingFalse
} = actions

export function fetchDocumentsByCategory(client, documentTemplate) {
  return async dispatch => {
    try {
      const docWithRules = creditApplicationTemplate.documents[documentTemplate]
      for (let i = 0; i < docWithRules.count; i++) {
        dispatch(
          setDocumentLoading({
            idDoctemplate: documentTemplate,
            index: i
          })
        )
      }
      const files = await fetchFilesByQualificationRules(client, docWithRules)
      if (files.data) {
        files.data.map((file, index) => {
          dispatch(
            fetchDocumentSuccess({
              file: file,
              idDoctemplate: documentTemplate,
              index
            })
          )
        })
      }
      /**
       * If we got less files that required, let's remove the loading state.
       * It's just because we don't have a file
       */
      if (files.data.length < docWithRules.count) {
        for (let i = files.data.length; i < docWithRules.count; i++) {
          dispatch(
            setLoadingFalse({
              file: undefined,
              idDoctemplate: documentTemplate,
              index: i
            })
          )
        }
      }
    } catch (error) {
      const docWithRules = creditApplicationTemplate.documents[documentTemplate]
      // If we had a global error for a category, let's set the error everywhere
      for (let i = 0; i < docWithRules.count; i++) {
        dispatch(
          fetchDocumentError({
            error: error.message,
            idDoctemplate: documentTemplate,
            index: i
          })
        )
      }
    }
  }
}

export const {
  getCompletedFromDrive,
  getCompletedDocumentsCount,
  getDocumentsTotal,
  getFiles,
  getFilesStatus
} = selectors
export default reducer
