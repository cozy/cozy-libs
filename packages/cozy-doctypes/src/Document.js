const omit = require('lodash/omit')
const pick = require('lodash/pick')
const size = require('lodash/size')
const omitBy = require('lodash/omitBy')
const isUndefined = require('lodash/isUndefined')
const fromPairs = require('lodash/fromPairs')
const pickBy = require('lodash/pickBy')
const flatMap = require('lodash/flatMap')
const groupBy = require('lodash/groupBy')
const sortBy = require('lodash/sortBy')
const get = require('lodash/get')
const { parallelMap } = require('./utils')
const CozyClient = require('cozy-client/dist/CozyClient').default
const log = require('cozy-logger').namespace('Document')
const querystring = require('querystring')

const DATABASE_DOES_NOT_EXIST = 'Database does not exist.'

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

// Attributes that will not be updated since the
// user can change them
const userAttributes = ['shortLabel']

function sanitizeKey(key) {
  if (key.startsWith('\\')) {
    return key.slice(1)
  }

  return key
}

function updateCreatedByApp(cozyMetadata, appSlug) {
  if (!cozyMetadata.updatedByApps) {
    cozyMetadata.updatedByApps = []
  }
  const now = new Date()
  for (const appInfo of cozyMetadata.updatedByApps) {
    if (appInfo.slug === appSlug) {
      appInfo.date = now
      return
    }
  }
  cozyMetadata.updatedByApps.push({ slug: appSlug, date: now })
}

const withoutUndefined = x => omitBy(x, isUndefined)

const flagForDeletion = x => Object.assign({}, x, { _deleted: true })

const getDocumentUpdateDate = doc => {
  const d = doc.cozyMetadata && doc.cozyMetadata.updatedAt
  return d ? new Date(d) : null
}

const newestDocumentComparisonFunc = doc => {
  const d = getDocumentUpdateDate(doc)
  return d ? -d : 0
}

class Document {
  /**
   * Registers a client
   *
   * @param {Client} client - Cozy client from either cozy-client or cozy-client-js
   */
  static registerClient(client) {
    if (!this.cozyClient) {
      this.cozyClient = client
    } else {
      // eslint-disable-next-line no-console
      console.warn(
        'Document already has been registered, this is not possible to re-register as the client is shared globally between all classes. This is to prevent concurrency bugs.'
      )
      throw new Error('Document cannot be re-registered to a client.')
    }
  }

  /**
   * @static copyWithClient - Returns a new class bound to a client
   *
   * @param  {type} client Client instance
   * @returns {type}        A new class, with the client registered
   */
  static copyWithClient(client) {
    const BaseClass = this
    class ExtendedClass extends BaseClass {}
    ExtendedClass.cozyClient = null
    ExtendedClass.registerClient(client)
    return ExtendedClass
  }

  /**
   * Returns true if Document uses a CozyClient (from cozy-client package)
   *
   * @returns {boolean} true if Document uses a CozyClient
   **/
  static usesCozyClient() {
    return this.cozyClient instanceof CozyClient
  }

  static getIndex(doctype, fields) {
    if (this.usesCozyClient()) {
      throw new Error('This method is not implemented yet with CozyClient')
    }

    return this.getIndexViaOldClient(doctype, fields)
  }

  static getIndexViaOldClient(doctype, fields) {
    const key = `${doctype}:${fields.slice().join(',')}`
    const index = indexes[key]
    if (!index) {
      indexes[key] = this.cozyClient.data
        .defineIndex(doctype, fields)
        .then(index => {
          indexes[key] = index
          return index
        })
    }
    return Promise.resolve(indexes[key])
  }

  static addCozyMetadata(attributes) {
    if (!attributes.cozyMetadata) {
      attributes.cozyMetadata = {}
    }

    attributes.cozyMetadata.updatedAt = new Date()

    if (!attributes.cozyMetadata.createdByApp && this.createdByApp) {
      attributes.cozyMetadata.createdByApp = this.createdByApp
    }

    if (this.createdByApp) {
      updateCreatedByApp(attributes.cozyMetadata, this.createdByApp)
    }

    return attributes
  }

  /**
   * Returns the item that has this id
   *
   * @param {string} id - The id of an item in the collection
   * @returns {object}  - The collection's item that has this id
   *
   */
  static async get(id) {
    if (!this.usesCozyClient()) {
      throw new Error('This method is not implemented with cozy-client-js')
    }

    if (!this.doctype) {
      throw new Error('doctype is not defined')
    }

    const resp = await this.cozyClient.collection(this.doctype).get(id)
    return resp.data
  }

  /**
   * Creates or updates a document.
   *
   * Before creating/updating, we try to find an existing document by
   * building a selector with the idAttributes.
   *
   * - If not document is found, document is created
   * - If a document is found, it is updated
   * - If duplicates are found, it depends on options.handleDuplicates
   *
   * @param {String|Function} options.handleDuplicates - How duplicates are handled, see Document.duplicateHandlingStrategies
   */
  static async createOrUpdate(attributes, options = {}) {
    if (this.usesCozyClient()) {
      return this.createOrUpdateViaNewClient(attributes, options)
    }

    return this.createOrUpdateViaOldClient(attributes, options)
  }

  /**
   * Update a document with `update` attributes. If the
   * `update` does not concern "important" attributes, the original
   * document is returned. Otherwise, the update document is
   * returned with metadata updated.
   *
   * @private
   */
  static applyUpdateIfDifferent(doc, update) {
    // only update if some fields are different
    if (
      !this.checkAttributes ||
      isDifferent(
        pick(doc, this.checkAttributes),
        pick(update, this.checkAttributes)
      )
    ) {
      // do not emit a mail for those attribute updates
      delete update.dateImport

      const updatedDoc = this.addCozyMetadata({
        ...doc,
        ...update
      })

      return updatedDoc
    } else {
      log(
        'debug',
        `[updateIfDifferent] No need to update ${update._id} because its \`checkedAttributes\` (${this.checkAttributes}) didn't change.`
      )
      return doc
    }
  }

  static getHandleDuplicateStrategy(name) {
    if (Document.duplicateHandlingStrategies[name]) {
      return Document.duplicateHandlingStrategies[name]
    } else {
      throw new Error(
        `${name} is not a know duplication handling strategy. Known strategies are ${Object.keys(
          Document.duplicateHandlingStrategies
        )}`
      )
    }
  }

  static async handleDuplicates(strategyNameOrFn, duplicates, selector) {
    strategyNameOrFn = strategyNameOrFn || this.defaultDuplicateHandling
    const strategyFn =
      typeof strategyNameOrFn === 'string'
        ? this.getHandleDuplicateStrategy(strategyNameOrFn)
        : strategyNameOrFn

    return await strategyFn.call(this, duplicates, selector)
  }

  static async createOrUpdateViaNewClient(attributes, options) {
    const selector = fromPairs(
      this.idAttributes.map(idAttribute => [
        idAttribute,
        get(attributes, sanitizeKey(idAttribute))
      ])
    )
    let results = []
    const compactedSelector = withoutUndefined(selector)
    if (size(compactedSelector) === this.idAttributes.length) {
      results = await this.queryAll(selector)
    }

    if (results.length === 0) {
      return this.create(this.addCozyMetadata(attributes))
    } else {
      results = sortBy(results, newestDocumentComparisonFunc)
      if (results.length > 1) {
        await this.handleDuplicates(options.handleDuplicates, results, selector)
      }
      const doc = results[0]
      const update = omit(attributes, userAttributes)
      const updatedDoc = this.applyUpdateIfDifferent(doc, update)
      if (updatedDoc !== doc) {
        return this.cozyClient.save(updatedDoc)
      } else {
        return updatedDoc
      }
    }
  }

  static async createOrUpdateViaOldClient(attributes, options) {
    const selector = fromPairs(
      this.idAttributes.map(idAttribute => [
        idAttribute,
        get(attributes, sanitizeKey(idAttribute))
      ])
    )
    let results = []
    const compactedSelector = withoutUndefined(selector)
    if (size(compactedSelector) === this.idAttributes.length) {
      const index = await this.getIndex(this.doctype, this.idAttributes)
      results = await this.cozyClient.data.query(index, { selector })
    }

    if (results.length === 0) {
      return this.cozyClient.data.create(
        this.doctype,
        this.addCozyMetadata(attributes)
      )
    } else {
      results = sortBy(results, newestDocumentComparisonFunc)
      if (results.length > 1) {
        await this.handleDuplicates(options.handleDuplicates, results, selector)
      }

      const doc = results[0]
      const update = omit(attributes, userAttributes)
      const updatedDoc = this.applyUpdateIfDifferent(doc, update)
      if (updatedDoc !== doc) {
        return this.cozyClient.data.updateAttributes(
          this.doctype,
          updatedDoc._id,
          updatedDoc
        )
      } else {
        return doc
      }
    }
  }

  static create(attributes) {
    if (this.usesCozyClient()) {
      return this.createViaNewClient(attributes)
    }

    return this.createViaOldClient(attributes)
  }

  static createViaNewClient(attributes) {
    return this.cozyClient.create(this.doctype, attributes)
  }

  static createViaOldClient(attributes) {
    return this.cozyClient.data.create(this.doctype, attributes)
  }

  /**
   * Save many documents concurrently
   */
  static bulkSave(documents, optionsOrConcurrency, logProgressOrNothing) {
    if (logProgressOrNothing || typeof optionsOrConcurrency !== 'object') {
      log(
        'warn',
        'Second argument of bulkSave is now an object, please use bulkSave(documents, { logProgress, concurrency })'
      )
    }

    const options = {}

    if (typeof optionsOrConcurrency === 'number') {
      options.concurrency = optionsOrConcurrency
    }

    if (typeof logProgressOrNothing === 'function') {
      options.logProgress = logProgressOrNothing
    }

    if (typeof optionsOrConcurrency === 'object') {
      Object.assign(options, optionsOrConcurrency)
    }

    return this._bulkSave(documents, options)
  }

  /**
   * @private
   *
   * Meat of the method bulkSave
   */
  static _bulkSave(documents, options = {}) {
    const { concurrency = 30, logProgress, ...createOrUpdateOptions } = options

    return parallelMap(
      documents,
      doc => {
        if (logProgress) {
          logProgress(doc)
        }
        return this.createOrUpdate(doc, createOrUpdateOptions)
      },
      concurrency
    )
  }

  static query(index, options) {
    if (this.usesCozyClient()) {
      throw new Error('This method is not implemented yet with CozyClient')
    }

    return this.queryViaOldClient(index, options)
  }

  static queryViaOldClient(index, options) {
    return this.cozyClient.data.query(index, options)
  }

  static async fetchAll() {
    const stackClient = this.usesCozyClient()
      ? this.cozyClient.stackClient
      : this.cozyClient

    try {
      const result = await stackClient.fetchJSON(
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
    const stackClient = this.usesCozyClient()
      ? this.cozyClient.stackClient
      : this.cozyClient

    if (!docs || !docs.length) {
      return Promise.resolve([])
    }
    try {
      const update = await stackClient.fetchJSON(
        'POST',
        `/data/${this.doctype}/_bulk_docs`,
        {
          docs
        }
      )
      return update
    } catch (e) {
      if (
        e.reason &&
        e.reason.reason &&
        e.reason.reason == DATABASE_DOES_NOT_EXIST
      ) {
        const firstDoc = await this.create(docs[0])
        const resp = await this.updateAll(docs.slice(1))
        resp.unshift({ ok: true, id: firstDoc._id, rev: firstDoc._rev })
        return resp
      } else {
        throw e
      }
    }
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

  /**
   * Delete duplicates on the server. Find duplicates according to the
   * idAttributes.
   *
   * @param  {Function} Priority (optional). Among duplicates, which one should be prioritized)
   * @return {Promise}
   * @example
   * ```
   * deleteDuplicates(doc => -doc.dateImport) // will duplicate documents so that the oldest document is conserved
   * ```
   */
  static async deleteDuplicates(priorityFn) {
    let allDocs = await this.fetchAll()
    if (priorityFn) {
      allDocs = sortBy(allDocs, priorityFn)
    }
    const duplicates = this.findDuplicates(allDocs)
    return this.deleteAll(duplicates)
  }

  /**
   * Use Couch _changes API
   *
   * @param  {string} since     Starting sequence for changes
   * @param  {[type]} options   { includeDesign: false, includeDeleted: false }
   */
  static async fetchChanges(since, options = {}) {
    const stackClient = this.usesCozyClient()
      ? this.cozyClient.stackClient
      : this.cozyClient

    const queryParams = {
      since,
      include_docs: 'true'
    }
    if (options.params) {
      Object.assign(queryParams, options.params)
    }
    const result = await stackClient.fetchJSON(
      'GET',
      `/data/${this.doctype}/_changes?${querystring.stringify(queryParams)}`
    )

    const newLastSeq = result.last_seq
    let docs = result.results.map(x => x.doc).filter(Boolean)

    if (!options.includeDesign) {
      docs = docs.filter(doc => doc._id.indexOf('_design') !== 0)
    }

    if (!options.includeDeleted) {
      docs = docs.filter(doc => !doc._deleted)
    }

    return { newLastSeq, documents: docs }
  }

  /**
   * Fetches all documents for a given doctype exceeding the 100 limit.
   * It is slower that fetchAll because it fetches the data 100 by 100 but allows to filter the data
   * with a selector and an index
   *
   * Parameters:
   *
   * * `selector` (object): the mango query selector
   * * `index` (object): (optional) the query selector index. If not defined, the function will
   * create it's own index with the keys specified in the selector
   *
   *
   * ```javascript
   * const documents = await Bills.queryAll({vendor: 'Direct Energie'})
   * ```
   *
   */
  static async queryAll(selector, index) {
    if (this.usesCozyClient()) {
      return this.queryAllViaNewClient(selector)
    }

    return this.queryAllViaOldClient(selector, index)
  }

  static async queryAllViaNewClient(selector) {
    if (!selector) {
      return this.fetchAll()
    }

    const result = []

    const query = this.cozyClient.find(this.doctype).where(selector)
    let resp = { next: true }
    while (resp && resp.next) {
      resp = await this.cozyClient.query(query.offset(result.length))
      result.push(...resp.data)
    }

    return result
  }

  static async queryAllViaOldClient(selector, index) {
    if (!selector) {
      // fetchAll is faster in this case
      return await this.fetchAll()
    }

    if (!index) {
      index = await this.cozyClient.data.defineIndex(
        this.doctype,
        Object.keys(selector)
      )
    }

    const result = []
    let resp = { next: true }
    while (resp && resp.next) {
      resp = await this.cozyClient.data.query(index, {
        selector,
        wholeResponse: true,
        skip: result.length
      })
      result.push(...resp.docs)
    }
    return result
  }

  /**
   * Fetch in one request a batch of documents by id.
   * @param  {String[]} ids - Ids of documents to fetch
   * @return {Promise} - Promise resolving to an array of documents, unfound document are filtered
   */
  static async getAll(ids) {
    const stackClient = this.usesCozyClient()
      ? this.cozyClient.stackClient
      : this.cozyClient
    let resp
    try {
      resp = await stackClient.fetchJSON(
        'POST',
        `/data/${this.doctype}/_all_docs?include_docs=true`,
        {
          keys: ids
        }
      )
    } catch (error) {
      if (error.message.match(/not_found/)) {
        return []
      }
      throw error
    }
    const rows = resp.rows.filter(row => row.doc)
    return rows.map(row => row.doc)
  }
}

Document.defaultDuplicateHandling = 'throw'

Document.duplicateHandlingStrategies = {
  throw: function(duplicates, selector) {
    throw new Error(
      'Create or update with selectors that returns more than 1 result\n' +
        JSON.stringify(selector) +
        '\n' +
        JSON.stringify(duplicates)
    )
  },

  remove: async function(duplicates) {
    const docsToRemove = duplicates.slice(1)
    if (docsToRemove.length > 0) {
      log(
        'warn',
        `Cleaning duplicates for doctype ${this.doctype} (kept: ${
          duplicates[0]._id
        }, removed: ${docsToRemove.map(x => x._id)})`
      )
      await this.deleteAll(docsToRemove)
    }
  }
}

module.exports = Document
