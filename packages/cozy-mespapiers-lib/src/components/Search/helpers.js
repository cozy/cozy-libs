import { index, addDoc, updateDoc } from './search'

export const addAllOnce = (t, isAdded, setIsAdded) => docs => {
  if (!isAdded) {
    for (const doc of docs) {
      addDoc({ index, doc, t })
    }
    setIsAdded(true)
  }
}

export const makeReducedResultIds = flexsearchResult =>
  flexsearchResult?.reduce((acc, curr) => {
    curr?.result?.forEach(id => {
      const isAlreadyReturned = acc.findIndex(el => el === id) !== -1
      if (!isAlreadyReturned) {
        acc.push(id)
      }
    })
    return acc
  }, [])

export const search = ({ docs, value, tag }) => {
  const filteredDocs = index.search(value, { tag })
  const resultsIds = makeReducedResultIds(filteredDocs)

  return (
    resultsIds?.map(resultId => docs.find(doc => doc._id === resultId)) || []
  )
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
