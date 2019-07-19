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
const CozyClient = require('cozy-client').default
const log = require('cozy-logger').namespace('Document')

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

const NotImplementedInNewClientError = () => {
  return new Error('This method is not implemented yet with CozyClient')
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
   * Returns true if Document uses a CozyClient (from cozy-client package)
   *
   * @returns {boolean} true if Document uses a CozyClient
   **/
  static usesCozyClient() {
    return this.cozyClient instanceof CozyClient
  }

  static getIndex(doctype, fields) {
    if (this.usesCozyClient()) {
      throw NotImplementedInNewClientError()
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

  static get newClient() {
    if (this.usesCozyClient()) {
      return this.cozyClient
    }
    if (!this._newClient) {
      this._newClient = new CozyClient({
        uri: this.cozyClient._uri,
        token: this.cozyClient._token
      })
    }
    return this._newClient
  }

  static async createOrUpdate(attributes) {
    if (this.usesCozyClient()) {
      return this.createOrUpdateViaNewClient(attributes)
    }

    return this.createOrUpdateViaOldClient(attributes)
  }

  static async createOrUpdateViaNewClient(attributes) {
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
    } else if (results.length === 1) {
      const update = omit(attributes, userAttributes)

      // only update if some fields are different
      if (
        !this.checkAttributes ||
        isDifferent(
          pick(results[0], this.checkAttributes),
          pick(update, this.checkAttributes)
        )
      ) {
        // do not emit a mail for those attribute updates
        delete update.dateImport

        const updated = this.addCozyMetadata({
          ...results[0],
          ...update
        })

        return this.cozyClient.save(updated)
      } else {
        log(
          'debug',
          `[createOrUpdate] Didn't update ${
            results[0]._id
          } because its \`checkedAttributes\` (${
            this.checkAttributes
          }) didn't change.`
        )
        return results[0]
      }
    } else {
      throw new Error(
        'Create or update with selectors that returns more than 1 result\n' +
          JSON.stringify(selector) +
          '\n' +
          JSON.stringify(results)
      )
    }
  }

  static async createOrUpdateViaOldClient(attributes) {
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
    } else if (results.length === 1) {
      const id = results[0]._id
      const update = omit(attributes, userAttributes)

      // only update if some fields are different
      if (
        !this.checkAttributes ||
        isDifferent(
          pick(results[0], this.checkAttributes),
          pick(update, this.checkAttributes)
        )
      ) {
        // do not emit a mail for those attribute updates
        delete update.dateImport

        return this.cozyClient.data.updateAttributes(
          this.doctype,
          id,
          this.addCozyMetadata(update)
        )
      } else {
        log(
          'debug',
          `[bulkSave] Didn't update ${
            results[0]._id
          } because its \`checkedAttributes\` (${
            this.checkAttributes
          }) didn't change.`
        )
        return results[0]
      }
    } else {
      throw new Error(
        'Create or update with selectors that returns more than 1 result\n' +
          JSON.stringify(selector) +
          '\n' +
          JSON.stringify(results)
      )
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

  static bulkSave(documents, concurrency, logProgress) {
    concurrency = concurrency || 30
    return parallelMap(
      documents,
      doc => {
        if (logProgress) {
          logProgress(doc)
        }
        return this.createOrUpdate(doc)
      },
      concurrency
    )
  }

  static query(index, options) {
    if (this.usesCozyClient()) {
      throw NotImplementedInNewClientError()
    }

    return this.queryViaOldClient(index, options)
  }

  static queryViaOldClient(index, options) {
    return this.cozyClient.data.query(index, options)
  }

  static async fetchAll() {
    const { data } = await this.newClient
      .collection(this.doctype)
      .all({ limit: null })
    return data
  }

  static async updateAll(docs) {
    const stackClient = this.newClient.stackClient

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
   * Deletes doc
   *
   * @param  {Document} doc - At least { _id, _rev }
   */
  static async delete(doc) {
    const client = this.newClient
    return client.collection(this.doctype).destroy(doc)
  }

  /**
   * Deletes all docs (one HTTP call)
   *
   * All docs need { _id, _rev }
   */
  static async deleteAll(docs) {
    return this.updateAll(docs.map(flagForDeletion))
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
    const col = this.newClient.collection(this.doctype)
    return col.fetchChanges({
      since,
      include_docs: true,
      ...options.params
    })
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
   * Returns the item that has this id
   *
   * @param {string} id - The id of an item in the collection
   * @returns {object}  - The collection's item that has this id
   *
   */
  static async get(id) {
    if (!this.doctype) {
      throw new Error('doctype is not defined')
    }

    const { data } = await this.newClient.collection(this.doctype).get(id)
    return data
  }

  /**
   * Fetch in one request a batch of documents by id.
   * @param  {String[]} ids - Ids of documents to fetch
   * @return {Promise} - Promise resolving to an array of documents, unfound document are filtered
   */
  static async getAll(ids) {
    const { data } = await this.newClient.collection(this.doctype).getAll(ids)
    return data.map(x => omit(x, ['id', '_type']))
  }
}

module.exports = Document
