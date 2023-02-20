import { index, addDocs } from '../../utils/search'
import { FILES_DOCTYPE } from '../../doctypes'

const updateFile = doc => {
  if (doc.trashed) {
    index.remove(doc._id)
  }
}

export const onUpdate = doctype => async doc => {
  if (doctype === FILES_DOCTYPE) {
    return updateFile(doc)
  }
}

export const onCreate = (doctype, scannerT) => async doc => {
  addDocs({ index, docs: [{ ...doc, _type: doctype }], scannerT })
}

export const add = (isInit, scannerT, setIsInit) => docs => {
  if (!isInit) {
    addDocs({ index, docs, scannerT })
    setIsInit(true)
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
