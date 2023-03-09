import { index, addDoc, updateDoc } from './search'

export const addAllOnce = (t, isAdded, setIsAdded) => docs => {
  if (!isAdded) {
    for (const doc of docs) {
      addDoc({ index, doc, t })
    }
    setIsAdded(true)
  }
}

export const search = ({ docs, value, tag }) => {
  const filteredDocs = index.search(value, { tag })

  const resultsIds = filteredDocs?.[0]?.result?.map(doc => doc.id)

  const resultDocs =
    resultsIds?.map(resultId => docs.find(doc => doc._id === resultId)) || []

  return resultDocs
}

const onCreate = t => async doc => {
  addDoc({ index, doc, t })
}

const onUpdate = t => async doc => {
  updateDoc({ index, doc, t })
}

export const makeRealtimeConnection = (doctypes, t) =>
  doctypes.reduce(
    (acc, curr) => ({
      ...acc,
      [`${curr}`]: {
        created: onCreate(t),
        updated: onUpdate(t)
      }
    }),
    {}
  )
