import get from 'lodash/get'
import merge from 'lodash/merge'

const updateArray = (array, index, el) => {
  return [...array.slice(0, index), el, ...array.slice(index + 1)]
}

export const getHasManyItem = (doc, relationshipName, relationshipItemId) => {
  const relationships = get(doc, `relationships.${relationshipName}.data`, [])
  return relationships.find(rel => rel._id == relationshipItemId)
}

export const setHasManyItem = (
  document,
  relationshipName,
  relId,
  relAttributes
) => {
  const relationship = get(
    document,
    `relationships.${relationshipName}.data`,
    []
  )
  const relIndex = relationship.findIndex(rel => rel._id === relId)
  const updatedRel = merge({}, relationship[relIndex], relAttributes)
  const updatedRelationship = updateArray(relationship, relIndex, updatedRel)
  const updatedDocument = {
    ...document,
    relationships: {
      ...(document.relationships || {}),
      [relationshipName]: {
        data: updatedRelationship
      }
    }
  }
  return updatedDocument
}

export const updateHasManyItem = (
  document,
  relationshipName,
  relId,
  updater
) => {
  const relItem = getHasManyItem(document, relationshipName, relId)
  const updatedRelItem = updater(relItem)
  return setHasManyItem(document, relationshipName, relId, updatedRelItem)
}
