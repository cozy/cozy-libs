/**
 * @typedef createTemporaryTokenResponse
 * @property {String} code - the temporary token
 * @property {String} url - BI environment url
 * @property {String} bankId - Cozy bank id corresponding to the current connector (deprecated once bi webviews are in production)
 * @property {String} biBankId - BI bank id corresponding to the bankId translated by the connector (deprecated once bi webviews are in production)
 * @property {Array<String>} bankIds - Cozy bank ids corresponding to the current connector
 * @property {Array<String>} biBankIds - BI bank ids corresponding to the bankIds translated by the connector
 * @property {Object} biMapping - Association table of any cozy bank id to corresponding bi bank id
 * @property {String?} _rev
 * @property {String} publicKey
 * @property {String} clientId
 * @property {String} mode
 * @property {timestamp?} timestamp
 * @property {String} userId - BI User id used to create the tmp token
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

/**
 * @typedef {import("../../node_modules/cozy-client/types/types").CozyClientDocument} CozyClientDocument
 */

/**
 * @typedef {import("cozy-client/dist/index").CozyClient} CozyClient
 */

/**
 * @typedef KonnectorManifest
 * @property {String} slug
 * @property {object} parameters
 * @property {object} fields
 * @property {object} aggregator
 */

/**
 * @typedef KonnectorPolicy
 * @property {Boolean} accountContainsAuth
 * @property {Boolean} saveInVault
 * @property {Function} onAccountCreation
 * @property {Function} match
 * @property {String} name
 * @property {Function} refreshContracts
 * @property {Function} fetchExtraOAuthUrlParams
 * @property {Boolean} [isBIWebView]
 * @property {Function} sendAdditionalInformation
 * @property {Function} getAdditionalInformationNeeded
 * @property {Boolean} needsAccountAndTriggerCreation
 * @property {Boolean} needsTriggerLaunch
 * @property {Function} onLaunch
 * @property {Boolean} isRunnable
 * @property {Function} shouldLaunchRedirectToEdit
 * @property {Function} shouldLaunchDisplayOAuthWindow
 * @property {Function} shouldDisplayRunningAlert
 */

/**
 * @typedef {CozyClientDocument} IoCozyAccount
 *
 */

/**
 * @typedef{CozyClientDocument} IoCozyJob
 */
