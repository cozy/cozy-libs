import { index, addDoc } from './search'
import { FILES_DOCTYPE } from '../../doctypes'

const updateFile = (doc, t) => {
  if (doc.trashed) {
    index.remove(doc._id)
  } else {
    addDoc({ index, doc, t }) // will perform update if id already indexed, see https://github.com/nextapps-de/flexsearch#append-contents
  }
}

const onUpdate = (doctype, t) => async doc => {
  if (doctype === FILES_DOCTYPE) {
    return updateFile(doc, t)
  }
}

const onCreate = (doctype, t) => async doc => {
  addDoc({ index, doc, t })
}

export const addAllOnce = (t, isAdded, setIsAdded) => docs => {
  if (!isAdded) {
    for (const doc of docs) {
      addDoc({ index, doc, t })
    }
    setIsAdded(true)
  }
}

export const search = ({ docs, value, tag }) => {
  const filteredDocs = index.search(value, {
    tag,
    enrich: true
  })

  const resultsIds = filteredDocs?.[0]?.result?.map(doc => doc.id)

  const resultDocs = resultsIds.map(resultIds =>
    docs.find(doc => doc._id === resultIds)
  )

  return resultDocs
}

export const makeRealtimeConnection = (doctypes, t) =>
  doctypes.reduce(
    (acc, curr) => ({
      ...acc,
      [`${curr}`]: {
        created: onCreate(curr, t),
        updated: onUpdate(curr, t)
      }
    }),
    {}
  )
