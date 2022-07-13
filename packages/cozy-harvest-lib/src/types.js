/**
 * @typedef createTemporaryTokenResponse
 * @property {String} code - the temporary token
 * @property {String} url - BI environment url
 * @property {String} bankId - Cozy bank id corresponding to the current connector (deprecated once bi webviews are in production)
 * @property {String} biBankId - BI bank id corresponding to the bankId translated by the connector (deprecated once bi webviews are in production)
 * @property {Array<String>} bankIds - Cozy bank ids corresponding to the current connector
 * @property {Array<String>} biBankIds - BI bank ids corresponding to the bankIds translated by the connector
 * @property {Object} biMapping - Association table of any cozy bank id to corresponding bi bank id
 */

/**
 * @typedef biConnection
 * @property {number} id
 * @property {number} id_user
 * @property {number} id_connector
 * @property {string|null} state  - ( wrongpass | additionalInformationNeeded | websiteUnavailable | actionNeeded | SCARequired | decoupled | passwordExpired | webauthRequired | rateLimiting | bug). Null indicates a success
 * @property {string|null} last_update - Date string: Last successful update.
 * @property {string|null} created - Date string: Creation date
 * @property {boolean} active - Whether this connection is active and will be automatically synced.
 * @property {string|null} last_push - Date string: Last successfull push
 * @property {string|null} next_try - Date string: Date of next synchronization.
 */
