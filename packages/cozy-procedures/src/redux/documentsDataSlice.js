import { createSlice } from 'redux-starter-kit'
import get from 'lodash/get'
import { creditApplicationTemplate } from 'cozy-procedures'
import { AdministrativeProcedure } from 'cozy-doctypes'

const documentsSlice = createSlice({
  initialState: {
    completedFromDrive: 0,
    data: {
      /*  payslip: {
        files: []
      } */
    },
    ui: {
      /* payslip: {
        loading: true,
        error: false
      } */
      initiated: false
    }
  },
  slice: 'documents',
  reducers: {
    init: (state, action) => {
      console.log('action', action)
      return {
        completedFromDrive: 0,
        data: Object.keys(action.payload).reduce((acc, fieldId) => {
          //init files with undefined value
          acc[fieldId] = {
            files: Array.from(Array(action.payload[fieldId].count))
          }
          return acc
        }, {}),
        ui: Object.keys(action.payload).reduce((acc, fieldId) => {
          const count = action.payload[fieldId].count
          acc[fieldId] = Array.from(Array(count))
          for (let i = 0; i < count; i++) {
            acc[fieldId][i] = {
              loading: false,
              error: false
            }
          }

          return acc
        }, {})
      }
    },

    fetchDocumentLoading: (state, action) => {
      const { idDoctemplate, loading, index } = action.payload
      state.ui[idDoctemplate][index].loading = loading
    },
    fetchDocumentSuccess: (state, action) => {
      const { idDoctemplate, loading, file, index } = action.payload
      state.ui[idDoctemplate][index].loading = loading
      state.data[idDoctemplate].files[index] = file
      state.completedFromDrive += 1
    },
    fetchDocumentError: (state, action) => {
      const { idDoctemplate, error } = action.payload
      state.ui[idDoctemplate].error = error
    },
    setProcedureStatus: (state, action) => {
      state.ui.initiated = action.payload.initiated
    },
    unlinkDocument: (state, action) => {
      const { documentId, index } = action.payload
      state.data[documentId].files[index] = undefined
    },
    linkDocumentSuccess: (state, action) => {
      const { document, documentId, index } = action.payload
      state.data[documentId].files[index] = document
    },
    setLoadingFalse: (state, action) => {
      const { idDoctemplate, loading, index } = action.payload
      state.ui[idDoctemplate][index].loading = loading
    }
  }
})

const getData = state => get(state, [documentsSlice.slice, 'data'], {})

const getCompletedCount = state =>
  Object.values(getData(state)).reduce(
    (acc, { files }) => acc + files.length,
    0
  )

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
  getInitiated: state =>
    get(state, [documentsSlice.slice, 'ui', ['initiated']], {}),
  getFilesStatus: state => get(state, [documentsSlice.slice, 'ui'], {})
}

const { actions, reducer } = documentsSlice
export const {
  init,
  update,
  fetchDocumentLoading,
  fetchDocumentSuccess,
  fetchDocumentError,
  setProcedureStatus,
  unlinkDocument,
  linkDocumentSuccess,
  setLoadingFalse
} = actions

export function setLoadingForDocument(documentTemplate, index) {
  return dispatch => {
    try {
      dispatch(
        fetchDocumentLoading({
          loading: true,
          idDoctemplate: documentTemplate,
          index: index
        })
      )
    } catch (error) {
      console.log('error', error)
    }
  }
}
export function fetchDocumentsByCategory(documentTemplate) {
  return async dispatch => {
    try {
      const docWithRules = creditApplicationTemplate.documents[documentTemplate]
      for (let i = 0; i < docWithRules.count; i++) {
        dispatch(
          fetchDocumentLoading({
            loading: true,
            idDoctemplate: documentTemplate,
            index: i
          })
        )
      }

      const files = await AdministrativeProcedure.getFilesByRules(docWithRules)

      if (files.data) {
        files.data.map((file, index) => {
          dispatch(
            fetchDocumentSuccess({
              loading: false,
              file: file,
              idDoctemplate: documentTemplate,
              index
            })
          )
        })
      }

      if (files.data.length < docWithRules.count) {
        for (let i = files.data.length; i < docWithRules.count; i++) {
          dispatch(
            setLoadingFalse({
              loading: false,
              file: {},
              idDoctemplate: documentTemplate,
              index: i
            })
          )
        }
      }
    } catch (error) {
      dispatch(
        fetchDocumentError({
          error: error.message,
          idDoctemplate: documentTemplate
        })
      )
    }
  }
}

export const {
  getCompletedFromDrive,
  getCompletedDocumentsCount,
  getDocumentsTotal,
  getFiles,
  getInitiated,
  getFilesStatus
} = selectors
export default reducer
