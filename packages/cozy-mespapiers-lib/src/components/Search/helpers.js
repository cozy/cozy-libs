import { index, addDocs } from './search'
import { FILES_DOCTYPE } from '../../doctypes'

const updateFile = doc => {
  if (doc.trashed) {
    index.remove(doc._id)
  }
}

const onUpdate = doctype => async doc => {
  if (doctype === FILES_DOCTYPE) {
    return updateFile(doc)
  }
}

const onCreate = (doctype, t) => async doc => {
  addDocs({ index, docs: [{ ...doc, _type: doctype }], t })
}

export const addAllOnce = (t, isAdded, setIsAdded) => docs => {
  if (!isAdded) {
    addDocs({ index, docs, t })
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
        updated: onUpdate(curr)
      }
    }),
    {}
  )
