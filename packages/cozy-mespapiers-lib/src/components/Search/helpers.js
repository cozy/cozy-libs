import { index, addDoc, updateDoc } from './search'

export const addAllOnce =
  ({ isAdded, setIsAdded, scannerT, t }) =>
  docs => {
    if (!isAdded) {
      for (const doc of docs) {
        addDoc({ index, doc, scannerT, t })
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

export const makeFirstSearchResultMatchingAttributes = (results, id) =>
  results.map(x => (x.result.includes(id) ? x.field : undefined)).filter(x => x)

export const search = ({ docs, value, tag }) => {
  const results = index.search(value, { tag })
  const resultIds = makeReducedResultIds(results)

  const filteredDocs =
    resultIds
      ?.map(resultId => docs.find(doc => doc._id === resultId))
      .filter(x => x !== undefined) || []

  const firstSearchResultMatchingAttributes =
    makeFirstSearchResultMatchingAttributes(results, resultIds[0])

  return { filteredDocs, firstSearchResultMatchingAttributes }
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
