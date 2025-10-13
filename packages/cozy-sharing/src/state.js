import get from 'lodash/get'

import flag from 'cozy-flags'

const RECEIVE_SHARINGS = 'RECEIVE_SHARINGS'
const ADD_SHARING = 'ADD_SHARING'
const UPDATE_SHARING = 'UPDATE_SHARING'
const REVOKE_RECIPIENT = 'REVOKE_RECIPIENT'
const REVOKE_GROUP = 'REVOKE_GROUP'
const REVOKE_SELF = 'REVOKE_SELF'
const ADD_SHARING_LINK = 'ADD_SHARING_LINK'
const UPDATE_SHARING_LINK = 'UPDATE_SHARING_LINK'
const REVOKE_SHARING_LINK = 'REVOKE_SHARING_LINK'
const RECEIVE_PATHS = 'RECEIVE_PATHS'
export const SHARING_TYPE = {
  TWO_WAY: 'two-way',
  ONE_WAY: 'one-way'
}

// actions
export const receiveSharings = ({
  instanceUri,
  sharings = [],
  permissions = [],
  apps = []
}) => ({
  type: RECEIVE_SHARINGS,
  data: {
    sharings: sharings.filter(
      s => !areAllRecipientsRevoked(s) && !hasBeenSelfRevoked(s, instanceUri)
    ),
    permissions,
    apps
  }
})
export const addSharing = (data, path) => ({
  type: ADD_SHARING,
  data,
  path
})
export const updateSharing = sharing => ({
  type: UPDATE_SHARING,
  sharing
})
export const revokeRecipient = (sharing, index, path) => {
  return {
    type: REVOKE_RECIPIENT,
    /* We set revoked status to the revoked member.
    We can't just simply remove it, 'cauz we use the index
    to remove members..
    */
    sharing: {
      ...sharing,
      attributes: {
        ...sharing.attributes,
        members: sharing.attributes.members.map((m, idx) => {
          if (idx === index) {
            return {
              ...m,
              status: 'revoked'
            }
          }
          return m
        })
      }
    },
    path
  }
}
export const revokeGroup = (sharing, index, path) => {
  return {
    type: REVOKE_GROUP,
    /* We can't just simply remove a group,
    because we use the index to remove the other group
    */
    sharing: {
      ...sharing,
      attributes: {
        ...sharing.attributes,
        groups: sharing.attributes.groups.map((g, idx) => {
          if (idx === index) {
            return {
              ...g,
              revoked: true
            }
          }
          return g
        })
      }
    },
    path
  }
}
export const revokeSelf = sharing => ({ type: REVOKE_SELF, sharing })
export const addSharingLink = data => ({ type: ADD_SHARING_LINK, data })
export const updateSharingLink = data => ({ type: UPDATE_SHARING_LINK, data })
export const revokeSharingLink = permissions => ({
  type: REVOKE_SHARING_LINK,
  permissions
})
export const receivePaths = paths => ({ type: RECEIVE_PATHS, paths })
export const matchingInstanceName =
  (instanceUri = '') =>
  shareMember =>
    shareMember.instance &&
    shareMember.instance.toString().toLowerCase() === instanceUri.toLowerCase()

// reducers
const byIdInitialState = { sharings: [], permissions: [] }
const isItemEmpty = item =>
  item.sharings.length === 0 && item.permissions.length === 0
const updateByIdItem = (state, id, updater) => {
  const { [id]: byIdState, ...rest } = state
  const update = updater(byIdState || byIdInitialState)
  return isItemEmpty(update)
    ? rest
    : {
        ...rest,
        [id]: update
      }
}

const indexSharing = (state = {}, sharing) => {
  const sharedDocs = getSharedDocIds(sharing)
  return sharedDocs.reduce((byId, id) => {
    const updatedByIdItem = updateByIdItem(byId, id, state => ({
      ...state,
      // todo index by id instead of having an array
      sharings: Object.values(state.sharings).includes(sharing.id)
        ? [...state.sharings]
        : [...state.sharings, sharing.id]
    }))
    return updatedByIdItem
  }, state)
}

const forgetSharing = (state = {}, sharing) =>
  getSharedDocIds(sharing).reduce(
    (byId, id) =>
      updateByIdItem(byId, id, state => ({
        ...state,
        sharings: state.sharings.filter(sid => sid !== sharing.id)
      })),
    state
  )

const indexPermission = (state = {}, perm) =>
  getSharedDocIds(perm).reduce(
    (byId, id) =>
      updateByIdItem(byId, id, state => ({
        ...state,
        permissions: [...state.permissions, perm.id]
      })),
    state
  )

const forgetPermission = (state = {}, permission) =>
  getSharedDocIds(permission).reduce(
    (byId, id) =>
      updateByIdItem(byId, id, state => ({
        ...state,
        permissions: state.permissions.filter(pid => pid !== permission.id)
      })),
    state
  )

const byDocId = (state = {}, action) => {
  switch (action.type) {
    case RECEIVE_SHARINGS:
      // eslint-disable-next-line no-case-declarations
      const intermediaryState = action.data.sharings.reduce(
        (byId, sharing) => indexSharing(byId, sharing),
        state
      )
      return action.data.permissions.reduce(
        (byId, perm) => indexPermission(byId, perm),
        intermediaryState
      )
    case ADD_SHARING:
      return indexSharing(state, action.data)
    case REVOKE_GROUP:
    case REVOKE_RECIPIENT:
    case UPDATE_SHARING:
      if (areAllRecipientsRevoked(action.sharing)) {
        return forgetSharing(state, action.sharing)
      }
      return state
    case ADD_SHARING_LINK:
      if (!Array.isArray(action.data)) {
        return indexPermission(state, action.data)
      } else {
        let clonedState = { ...state }
        action.data.map(s => {
          clonedState = { ...indexPermission(clonedState, s) }
        })
        return clonedState
      }
    case REVOKE_SELF:
      return forgetSharing(state, action.sharing)
    case REVOKE_SHARING_LINK:
      return action.permissions.reduce(
        (byId, perm) => forgetPermission(byId, perm),
        state
      )
    default:
      return state
  }
}

const permissions = (state = [], action) => {
  switch (action.type) {
    case RECEIVE_SHARINGS:
      return action.data.permissions
    case ADD_SHARING_LINK:
      if (!Array.isArray(action.data)) {
        return [...state, action.data]
      } else {
        return [...state, ...action.data]
      }
    case UPDATE_SHARING_LINK:
      return state.map(p => (p.id === action.data.id ? action.data : p))
    case REVOKE_SHARING_LINK:
      // eslint-disable-next-line no-case-declarations
      const permIds = action.permissions.map(p => p.id)
      return state.filter(p => permIds.indexOf(p.id) === -1)
    default:
      return state
  }
}

const apps = (state = [], action) => {
  switch (action.type) {
    case RECEIVE_SHARINGS:
      return action.data.apps
    default:
      return state
  }
}

const sharings = (state = [], action) => {
  switch (action.type) {
    case RECEIVE_SHARINGS:
      return action.data.sharings
    case ADD_SHARING:
      // be sure that we're not adding the sharing twice
      // can be the case if we launch the create and
      // receive the realtime in the same time
      // TODO Index by index...
      // eslint-disable-next-line
      const filtered_state = state.filter(s => s.id !== action.data.id)
      return [...filtered_state, action.data]
    case UPDATE_SHARING:
    case REVOKE_GROUP:
    case REVOKE_RECIPIENT:
      return state.map(s => {
        return s.id !== action.sharing.id ? s : action.sharing
      })
    case REVOKE_SELF:
      return state.filter(s => s.id !== action.sharing.id)
    default:
      return state
  }
}

const sharedPaths = (state = [], action) => {
  switch (action.type) {
    case RECEIVE_PATHS:
      // !TODO Remove after we solved the sharedPaths bugs
      // eslint-disable-next-line
      return action.paths
    case ADD_SHARING:
      // !TODO Remove after we solved the sharedPaths bugs
      // eslint-disable-next-line
      const newState = [...state, action.path]
      return newState
    case REVOKE_GROUP:
    case REVOKE_RECIPIENT:
      if (areAllRecipientsRevoked(action.sharing)) {
        return state.filter(p => p !== action.path)
      }
      return state
    default:
      return state
  }
}

const reducer = (state = {}, action = {}) => ({
  byDocId: byDocId(state.byDocId, action),
  sharings: sharings(state.sharings, action),
  permissions: permissions(state.permissions, action),
  apps: apps(state.apps, action),
  sharedPaths: sharedPaths(state.sharedPaths, action)
})
export default reducer

// selectors
export const isOwner = (state, docId) => {
  if (state.byDocId[docId] && state.byDocId[docId].sharings.length !== 0) {
    return (
      getSharingById(state, state.byDocId[docId].sharings[0]).attributes
        .owner === true
    )
  }
  return true
}

export const isSharedDrive = (state, docId) => {
  if (state.byDocId[docId] && state.byDocId[docId].sharings.length !== 0) {
    return (
      getSharingById(state, state.byDocId[docId].sharings[0]).attributes
        .drive === true
    )
  }
  return false
}

export const canReshare = (state, docId, instanceUri) => {
  const sharing = getDocumentSharing(state, docId)
  const me = sharing.attributes.members.find(matchingInstanceName(instanceUri))
  return sharing.attributes.open_sharing === true && me && !me.read_only
}

export const getOwner = (state, docId) =>
  getRecipients(state, docId).find(r => r.status === 'owner')

export const getRecipients = (state, docId) => {
  const sharings = getDocumentSharings(state, docId)
  if (flag('sharing.show-recipient-groups')) {
    return getRecipientsWithGroups(sharings, docId)
  }

  return getRecipientsWithoutGroups(sharings, docId)
}

const getRecipientType = (sharing, member, documentType) => {
  // If member is read_only, for sure it's one-way
  if (member.read_only) {
    return 'one-way'
  }

  // Else if it is a shared drive, for sure it's two-way
  if (sharing.drive) {
    return 'two-way'
  }

  // Else, we keep the legacy way of determining the type
  // because we need to take some time to understand if we can
  // just return 'two-way' or not
  return documentType
}

const getRecipientsWithoutGroups = (sharings, docId) => {
  const recipients = sharings
    .map(sharing => {
      const type = getDocumentSharingType(sharing, docId)
      return sharing.attributes.members.map((m, idx) => ({
        ...m,
        index: `sharing-${sharing.id}-member-${idx}`,
        type: getRecipientType(sharing, m, type),
        sharingId: sharing.id,
        memberIndex: idx,
        avatarPath: `/sharings/${sharing.id}/recipients/${idx}/avatar`
      }))
    })
    .reduce((acc, member) => acc.concat(member), [])
    .filter(r => r.status !== 'revoked')
  if (recipients[0] && recipients[0].status === 'owner') {
    return [recipients[0], ...recipients.filter(r => r.status !== 'owner')]
  }
  return recipients
}

export const getRecipientsWithGroups = (sharings, docId) => {
  const recipients = sharings.flatMap(sharing => {
    const type = getDocumentSharingType(sharing, docId)
    const sharingId = sharing.id

    const members = sharing.attributes.members.map((m, idx) => ({
      ...m,
      type: getRecipientType(sharing, m, type),
      sharingId,
      index: `sharing-${sharing.id}-member-${idx}`,
      memberIndex: idx,
      avatarPath: `/sharings/${sharingId}/recipients/${idx}/avatar`
    }))

    const groups =
      sharing.attributes.groups
        ?.map((g, idx) => ({
          ...g,
          sharingId,
          index: `sharing-${sharing.id}-group-${idx}`,
          groupIndex: idx,
          owner: members[g.addedBy],
          members: members.filter(member => member.groups?.includes(idx))
        }))
        .filter(g => !g.revoked) || []

    return [
      ...members.filter(m => !m.only_in_groups && m.status !== 'revoked'),
      ...groups
    ]
  })

  if (recipients[0] && recipients[0].status === 'owner') {
    return [recipients[0], ...recipients.filter(r => r.status !== 'owner')]
  }

  return recipients
}

export const getSharingLink = (state, docId, documentType) => {
  // This shouldn't have happened, but unfortunately some duplicate sharing links have been created in the past
  const perms = getDocumentPermissions(state, docId)
  if (perms.length === 0) return null
  const perm = perms[0]
  // We used to use `email` as `codes` attribute for a sharingByLink.
  // But when we use cozy-client to create a Permission, by default
  // the codes attribute is set to `code`. MesPapiers app is using this
  // default behavior... So the sharing by link created by mes papiers
  // didn't appear correctly in cozy-sharing.
  // This is a bit ugly, we should have a better way to know if this is
  // a sharing by link or not.
  const code =
    get(perm, 'attributes.shortcodes.email') ||
    get(perm, 'attributes.shortcodes.code') ||
    get(perm, 'attributes.codes.email') ||
    get(perm, 'attributes.codes.code')
  if (code) {
    return buildSharingLink(state, documentType, code)
  } else {
    return null
  }
}

export const getSharingForSelf = (state, docId) =>
  getDocumentSharing(state, docId)

export const getSharingType = (state, docId, instanceUri) => {
  const sharing = getSharingForSelf(state, docId)
  if (!sharing) return false
  const type = getDocumentSharingType(sharing, docId)
  if (sharing.attributes.owner) return type
  const me = sharing.attributes.members.find(matchingInstanceName(instanceUri))
  return me && me.read_only ? 'one-way' : type
}

export const getDocumentSharing = (state, docId) =>
  getDocumentSharings(state, docId)[0] || null

const getDocumentSharings = (state, docId) =>
  !state.byDocId[docId]
    ? []
    : state.byDocId[docId].sharings.map(id => getSharingById(state, id))

export const getSharingById = (state, id) =>
  state.sharings.find(s => s.id === id)

export const getDocumentPermissions = (state, docId) =>
  !state.byDocId[docId]
    ? []
    : state.byDocId[docId].permissions.map(id => getPermissionById(state, id))

const getPermissionById = (state, id) =>
  state.permissions.find(s => s.id === id)

const getApps = state => state.apps

export const hasSharedParent = (state, documentPath) => {
  if (!state.sharedPaths) {
    return false // hasSharedParent should not occur
  }
  return state.sharedPaths.some(path => documentPath.indexOf(`${path}/`) === 0)
}

export const hasSharedChild = (state, documentPath) => {
  if (!state.sharedPaths) {
    return false // hasSharedChild should not occur
  }
  const ret = state.sharedPaths.some(
    path => path.indexOf(`${documentPath}/`) === 0
  )
  return ret
}

/**
 * Returns the path of the shared parent for a given document
 * @param {object} state - Redux state
 * @param {string} documentPath - Path of the given document
 * @returns {string|null} Path of the shared parent
 */
export const getSharedParentPath = (state, documentPath) => {
  if (hasSharedParent(state, documentPath)) {
    return state.sharedPaths.find(path => documentPath.startsWith(path))
  }
  return null
}

// helpers
export const getSharedDocIds = doc =>
  doc.type === 'io.cozy.sharings'
    ? getSharingDocIds(doc)
    : getPermissionDocIds(doc)

export const getSharingDocIds = sharing => {
  const docs = sharing.attributes.rules
    .map(r => r.values)
    .reduce((acc, val) => acc.concat(val), [])

  if (sharing.attributes.shortcut_id) {
    docs.push(sharing.attributes.shortcut_id)
  }

  return docs
}

/**
 * Get ids of shared documents, but only if sharing is ready so files exist
 * @param {object} sharing
 * @param {string} instanceUri
 * @returns {string[]} List of document ids of a sharing
 */
export const getExternalSharingIds = (sharing, instanceUri) => {
  const member = sharing.attributes.members.find(
    member => member.instance === instanceUri
  )

  let docs = []
  if (member?.status === 'ready') {
    docs = sharing.attributes.rules
      .map(r => r.values)
      .reduce((acc, val) => acc.concat(val), [])
  }

  if (sharing.attributes.shortcut_id) {
    docs.push(sharing.attributes.shortcut_id)
  }

  return docs
}

// Some permissions can not have values since they can
// be on a global doctype. In that case, we can't sort
// them by id
export const getPermissionDocIds = perm =>
  Object.keys(perm.attributes.permissions)
    .map(k =>
      perm.attributes.permissions[k].values
        ? perm.attributes.permissions[k].values
        : []
    )
    .reduce((acc, val) => [...acc, ...val], [])

const areAllRecipientsRevoked = sharing =>
  sharing.attributes.owner &&
  sharing.attributes.members.filter(m => m.status !== 'revoked').length === 1

const hasBeenSelfRevoked = (sharing, instanceUri) => {
  const me = sharing.attributes.members.find(matchingInstanceName(instanceUri))
  return !sharing.attributes.owner && me && me.status === 'revoked'
}

/**
 * Returns the sharing rule of a document
 * @param {object} sharing - The sharing
 * @param {string} docId - Id of the shared document
 * @returns {object} sharing rule
 */
const getSharingRule = (sharing, docId) =>
  sharing.attributes.rules.find(r => r.values.indexOf(docId) !== -1)

/**
 * Returns the sharing type of a directory
 * @param {object} rule - Sharing rule of a document
 * @returns {string} two-way or one-way
 */
const getDirectorySharingType = rule => {
  // If a document has no rule, it is a shortcut preview of a sharing.
  // Since the sharing hasn't been accepted, it can't be synced so we return the "one-way" type.
  // TODO : the sharing type shouldn't be based on rule but on ready_only prop of the member
  return rule && rule.update === 'sync' && rule.remove === 'sync'
    ? SHARING_TYPE.TWO_WAY
    : SHARING_TYPE.ONE_WAY
}

/**
 * Returns the sharing type of a file
 * @param {object} rule - Sharing rule of a document
 * @returns {string} two-way or one-way
 */
const getFileSharingType = rule => {
  // If a document has no rule, it is a shortcut preview of a sharing.
  // Since the sharing hasn't been accepted, it can't be synced so we return the "one-way" type.
  // TODO : the sharing type shouldn't be based on rule but on ready_only prop of the member
  return rule && rule.update === 'sync' && rule.remove === 'revoke'
    ? SHARING_TYPE.TWO_WAY
    : SHARING_TYPE.ONE_WAY
}

/**
 * Returns the sharing type of a document
 * @param {object} sharing - The sharing
 * @param {string} docId - Id of the shared document
 * @returns {string} two-way or one-way
 */
export const getDocumentSharingType = (sharing, docId) => {
  if (!sharing) return null
  const rule = getSharingRule(sharing, docId)
  const directorySharingType = getDirectorySharingType(rule)
  const fileSharingType = getFileSharingType(rule)

  return directorySharingType === SHARING_TYPE.TWO_WAY ||
    fileSharingType === SHARING_TYPE.TWO_WAY
    ? SHARING_TYPE.TWO_WAY
    : SHARING_TYPE.ONE_WAY
}

export const isReadOnlySharing = (sharing, docId) => {
  const rule = getSharingRule(sharing, docId)
  const directorySharingType = getDirectorySharingType(rule)
  const fileSharingType = getFileSharingType(rule)

  return directorySharingType === SHARING_TYPE.TWO_WAY ||
    fileSharingType === SHARING_TYPE.TWO_WAY
    ? false
    : true
}

const buildSharingLink = (state, documentType, sharecode) => {
  const appUrl = getAppUrlForDoctype(state, documentType)
  switch (documentType) {
    case 'Notes':
      return `${appUrl}public/?sharecode=${sharecode}`
    default:
      return `${appUrl}public?sharecode=${sharecode}`
  }
}

const getAppUrlForDoctype = (state, documentType) => {
  const apps = getApps(state)
  switch (documentType) {
    case 'Notes':
      return getAppUrl(apps, 'notes')
    case 'Files':
    case 'Document':
      return getAppUrl(apps, 'drive')
    case 'Albums':
      return getAppUrl(apps, 'photos')
    default:
      throw new Error(
        `Sharing link: don't know which app to use for doctype ${documentType}`
      )
  }
}

const getAppUrl = (apps, appName) => {
  const app = apps.find(a => a?.slug === appName && a?.state === 'ready')
  if (!app) {
    throw new Error(`Sharing link: app ${appName} not installed`)
  }
  return app.links.related
}

/**
 *
 * @param {SharingCollection} sharings
 * @return {Array} Array of docIds
 */
export const getSharedDocIdsBySharings = sharings => {
  const docs = []
  if (!sharings.data) return []
  sharings.data.forEach(s => {
    if (s.attributes && s.attributes.active) {
      docs.push(...getSharingDocIds(s))
    }
  })
  return docs
}

/**
 * Computes the effective sharing type for a drive.
 *
 * @param {string} state - the state
 * @param {string} driveId - the shared drive ID
 * @param {string} instanceUri - the URI of the instance
 * @returns {string|null} - the sharing type
 */
export const getSharedDriveSharingType = (state, driveId, instanceUri) => {
  const sharing = getSharingById(state, driveId)
  if (!sharing) return null

  const me = sharing.attributes.members?.find(matchingInstanceName(instanceUri))
  if (!me) return null

  return me.read_only ? SHARING_TYPE.ONE_WAY : SHARING_TYPE.TWO_WAY
}
