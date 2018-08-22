const { omit, pick } = require('lodash')
const size = require('lodash/size')
const omitBy = require('lodash/omitBy')
const isUndefined = require('lodash/isUndefined')
const fromPairs = require('lodash/fromPairs')
const pickBy = require('lodash/pickBy')
const flatMap = require('lodash/flatMap')
const groupBy = require('lodash/groupBy')
const sortBy = require('lodash/sortBy')
const get = require('lodash/get')
const PromisePool = require('es6-promise-pool')

let cozyClient

/**
 * Tell of two object attributes have any difference
 */
function isDifferent(o1, o2) {
  // This is not supposed to happen
  if (Object.keys(o1).length === 0) return true

  for (let key in o1) {
    if (o1[key] !== o2[key]) {
      return true
    }
  }
  return false
}

const indexes = {}
function getIndex(doctype, fields) {
  const key = `${doctype}:${fields.slice().join(',')}`
  const index = indexes[key]
  if (!index) {
    indexes[key] = cozyClient.data.defineIndex(doctype, fields).then(index => {
      indexes[key] = index
      return index
    })
  }
  return Promise.resolve(indexes[key])
}

// Attributes that will not be updated since the
// user can change them
const userAttributes = ['shortLabel']

function sanitizeKey(key) {
  if (key.startsWith('\\')) {
    return key.slice(1)
  }

  return key
}

const withoutUndefined = x => omitBy(x, isUndefined)

async function createOrUpdate(
  doctype,
  idAttributes,
  attributes,
  checkAttributes
) {
  const selector = fromPairs(
    idAttributes.map(idAttribute => [
      idAttribute,
      get(attributes, sanitizeKey(idAttribute))
    ])
  )
  let results = []
  const compactedSelector = withoutUndefined(selector)
  if (size(compactedSelector) === idAttributes.length) {
    const index = await getIndex(doctype, idAttributes)
    results = await cozyClient.data.query(index, { selector })
  }

  if (results.length === 0) {
    return cozyClient.data.create(doctype, attributes)
  } else if (results.length === 1) {
    const id = results[0]._id
    const update = omit(attributes, userAttributes)

    // only update if some fields are different
    if (
      !checkAttributes ||
      isDifferent(
        pick(results[0], checkAttributes),
        pick(update, checkAttributes)
      )
    ) {
      // do not emit a mail for those attribute updates
      delete update.dateImport

      return cozyClient.data.updateAttributes(doctype, id, update)
    } else {
      return results[0]
    }
  } else {
    throw new Error(
      'Linxo cozy: Create or update with selectors that returns more than 1 result\n' +
        JSON.stringify(selector) +
        '\n' +
        JSON.stringify(results)
    )
  }
}

const flagForDeletion = x => Object.assign({}, x, { _deleted: true })

class Document {
  static registerClient(client) {
    cozyClient = client
  }

  static createOrUpdate(attributes) {
    return createOrUpdate(
      this.doctype,
      this.idAttributes,
      attributes,
      this.checkedAttributes
    )
  }

  static create(attributes) {
    return cozyClient.data.create(this.doctype, attributes)
  }

  static bulkSave(documents, concurrency = 30) {
    const kls = this
    const res = []
    const pool = new PromisePool(function*() {
      for (let doc of documents) {
        yield kls.createOrUpdate(doc).then(x => res.push(x))
      }
    }, concurrency)
    return pool.start().then(() => res)
  }

  static query(index, options) {
    return cozyClient.data.query(index, options)
  }

  static getIndex(doctype, fields) {
    return getIndex(doctype, fields)
  }

  static async fetchAll() {
    try {
      const result = await cozyClient.fetchJSON(
        'GET',
        `/data/${this.doctype}/_all_docs?include_docs=true`
      )
      return result.rows
        .filter(x => x.id.indexOf('_design') !== 0 && x.doc)
        .map(x => x.doc)
    } catch (e) {
      if (e && e.response && e.response.status && e.response.status === 404) {
        return []
      } else {
        return []
      }
    }
  }

  static async updateAll(docs) {
    return cozyClient.fetchJSON('POST', `/data/${this.doctype}/_bulk_docs`, {
      docs
    })
  }

  static async deleteAll(docs) {
    return this.updateAll(docs.map(flagForDeletion))
  }

  /**
   * Find duplicates in a list of documents according to the
   * idAttributes of the class. Priority is given to the document
   * prior in the list.
   *
   * To introduce the notion of priority, you can sort your input docs
   * according to this priorirty.
   *
   * @param  {Array[object]} docs
   * @return {Array[object]} Duplicates
   */
  static findDuplicates(docs) {
    const fieldSeparator = '#$$$$#'
    const idAttributes = this.idAttributes
    const key = doc => {
      return idAttributes
        .map(idAttrPath => get(doc, idAttrPath))
        .join(fieldSeparator)
    }
    const groups = pickBy(groupBy(docs, key), group => group.length > 1)
    const duplicates = flatMap(groups, group => group.slice(1))
    return duplicates
  }

  static async deleteDuplicates(priorityFn) {
    let allDocs = this.fetchAll()
    if (priorityFn) {
      allDocs = sortBy(allDocs, priorityFn)
    }
    const duplicates = this.findDuplicates(allDocs)
    return this.deleteAll(duplicates)
  }
}

module.exports = Document
