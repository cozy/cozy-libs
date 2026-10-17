import React, { Component } from 'react'

import { withClient } from 'cozy-client'
import minilog from 'cozy-minilog'

import {
  generateShareLinkFromFile,
  getLinkAccessOptions
} from './components/ShareRestrictionModal/helpers'
import SharingContext from './context'
import { fetchNextPermissions } from './fetchNextPermissions'
import { mapEffectiveRecipients } from './helpers/effectiveRecipients'
import { fetchFilesPaths } from './helpers/files'
import {
  getSharingObject,
  createSharingInStore,
  updateSharingInStore
} from './helpers/sharings'
import { getShortcode } from './helpers/shortcodes'
import { SynchronousJobQueue } from './helpers/synchronousJobQueue'
import reducer, {
  receiveSharings,
  addSharing,
  updateSharing,
  addSharingLink,
  updateSharingLink,
  revokeSharingLink,
  revokeRecipient,
  revokeGroup as revokeGroupFromState,
  revokeSelf,
  receivePaths,
  receiveEffectiveRecipients,
  updateEffectiveRecipient,
  invalidateEffectiveRecipients,
  getEffectiveRecipients,
  isOwner,
  isSharedDrive,
  isOrgSharedDrive,
  canLeave,
  canReshare,
  getOwner,
  getRecipients,
  getSharingById,
  getExternalSharingIds,
  getSharingForSelf,
  getSharingType,
  getSharingLink,
  getSharedDocIdsBySharings,
  getDocumentSharing,
  getDocumentPermissions,
  getPermissionDocIds,
  hasSharedParent,
  hasSharedChild,
  getSharedParentPath,
  getSharedDriveSharingType,
  SHARING_TYPE
} from './state'

const log = minilog('SharingProvider')
const SHARING_DOCTYPE = 'io.cozy.sharings'
const PERMISSION_DOCTYPE = 'io.cozy.permissions'

const getDocumentId = document => document?._id || document?.id || null

export class SharingProvider extends Component {
  constructor(props, context) {
    super(props, context)
    const instanceUri = props.client.getStackClient().uri
    const subDomainType = props.client.getInstanceOptions().subdomain
    const documentType = props.documentType || 'Document'
    const onShared = props.onShared || (() => {})

    this.fetchAllSharings = this.fetchAllSharings.bind(this)
    this.state = {
      byDocId: {},
      sharings: [],
      permissions: [],
      sharedFolderPaths: [],
      documentType,
      instanceUri,
      subDomainType,
      isOwner: docId => isOwner(this.state, docId),
      isSharedDrive: docId => isSharedDrive(this.state, docId),
      isOrgSharedDrive: docId => isOrgSharedDrive(this.state, docId),
      canLeave: docId => canLeave(this.state, docId),
      canReshare: docId => canReshare(this.state, docId, instanceUri),
      getOwner: docId => getOwner(this.state, docId),
      getSharingType: docId => getSharingType(this.state, docId, instanceUri),
      getSharingById: docId => getSharingById(this.state, docId),
      getSharingForSelf: docId => getSharingForSelf(this.state, docId),
      getRecipients: docId => getRecipients(this.state, docId),
      getSharedParentPath: documentPath =>
        getSharedParentPath(this.state, documentPath),
      getDocumentPermissions: docId =>
        getDocumentPermissions(this.state, docId),
      getSharingLink: docId => getSharingLink(this.state, docId, documentType),
      hasSharedParent: documentPath =>
        hasSharedParent(this.state, documentPath),
      hasSharedChild: documentPath => hasSharedChild(this.state, documentPath),
      share: this.share,
      onShared: onShared,
      revoke: this.revoke,
      revokeGroup: this.revokeGroup,
      revokeSelf: this.revokeSelf,
      shareByLink: this.shareByLink,
      ensureSharingLink: this.ensureSharingLink,
      getFederatedShareLink: this.getFederatedShareLink,
      fetchSharedDriveSharingLinks: this.fetchSharedDriveSharingLinks,
      updateDocumentPermissions: this.updateDocumentPermissions,
      revokeSharingLink: this.revokeSharingLink,
      hasLoadedAtLeastOnePage: false,
      allLoaded: false,
      revokeAllRecipients: this.revokeAllRecipients,
      refresh: this.fetchAllSharings,
      hasWriteAccess: this.hasWriteAccess,
      renameSharedDrive: this.renameSharedDrive,
      updateSharingMemberType: this.updateSharingMemberType,
      getEffectiveRecipients: docId =>
        getEffectiveRecipients(this.state, docId),
      fetchEffectiveRecipients: this.fetchEffectiveRecipients,
      invalidateEffectiveRecipients: this.invalidateEffectiveRecipients
    }
    this.isPublic = props.isPublic ?? false
    this.realtime = null
    this.isInitialized = false

    this.synchronousJobQueue = new SynchronousJobQueue()

    const { client } = props
    this.sharingCol = client.collection(SHARING_DOCTYPE)
    this.permissionCol = client.collection(PERMISSION_DOCTYPE)
  }

  dispatch = action =>
    this.setState(state => ({ ...state, ...reducer(state, action) }))

  componentDidMount() {
    const { client } = this.props

    if (client.isLogged) {
      this.initialize()
    } else {
      client.on('plugin:realtime:login', this.initialize)
    }
  }

  componentWillUnmount() {
    if (this.realtime) {
      this.realtime.unsubscribe(
        'created',
        SHARING_DOCTYPE,
        this.handleCreateOrUpdateSharings
      )
      this.realtime.unsubscribe(
        'updated',
        SHARING_DOCTYPE,
        this.handleCreateOrUpdateSharings
      )
    }
  }

  initialize = () => {
    if (this.isInitialized) return
    const { client } = this.props

    this.fetchAllSharings()
    if (!client.plugins.realtime) {
      // eslint-disable-next-line
         console.warn(
        `You should register the realtime plugin to your CozyClient instance see https://docs.cozy.io/en/cozy-realtime/#example`
      )
    } else {
      this.realtime = client.plugins.realtime
      this.realtime.subscribe(
        'created',
        SHARING_DOCTYPE,
        this.handleCreateOrUpdateSharings
      )
      this.realtime.subscribe(
        'updated',
        SHARING_DOCTYPE,
        this.handleCreateOrUpdateSharings
      )
    }

    this.isInitialized = true
  }

  handleCreateOrUpdateSharings = async sharing => {
    const { client, doctype } = this.props
    const internalSharing = getSharingById(this.state, sharing._id)
    const newSharing = getSharingObject(internalSharing, sharing)
    if (internalSharing) {
      updateSharingInStore(this.dispatch, newSharing)
    } else {
      const docsId = getExternalSharingIds(
        newSharing,
        client.getStackClient().uri
      )
      this.synchronousJobQueue.push({
        function: createSharingInStore,
        arguments: {
          client,
          doctype,
          dispatch: this.dispatch,
          docsId,
          sharing: newSharing
        }
      })
    }
  }

  async fetchAllSharings() {
    if (this.isPublic) {
      // In public mode, the promise below fails because the methods do not have the required permissions.
      log.warn('fetchAllSharings is not allowed in public context.')
      this.setState({ allLoaded: true })
      return
    }
    const { doctype, client } = this.props
    const [sharings, permissions] = await Promise.all([
      this.sharingCol.findByDoctype(doctype, { withSharedDocs: false }),
      this.permissionCol.findLinksByDoctype(doctype)
    ])
    this.dispatch(
      receiveSharings({
        instanceUri: client.options.uri,
        sharings: sharings.data,
        permissions: permissions.data
      })
    )
    this.setState({ hasLoadedAtLeastOnePage: true })

    await fetchNextPermissions(permissions, this.dispatch, this.permissionCol)

    if (doctype === 'io.cozy.files') {
      const sharedDocIds = getSharedDocIdsBySharings(sharings)
      const resp = await client.collection(doctype).all({ keys: sharedDocIds })
      const folderPaths = resp.data
        .filter(f => f.type === 'directory' && !f.trashed)
        .map(f => f.path)
      const filePaths = await fetchFilesPaths(
        client,
        doctype,
        resp.data.filter(f => f.type !== 'directory' && !f.trashed)
      )

      this.dispatch(receivePaths([...folderPaths, ...filePaths]))
    }

    this.setState({ allLoaded: true })
  }

  share = async ({
    document,
    recipients,
    readOnlyRecipients,
    description,
    openSharing,
    sharedDrive
  }) => {
    const { client, doctype } = this.props
    const sharing = getDocumentSharing(this.state, document.id)
    if (sharing) {
      const sharingResult = await this.addRecipients({
        document: sharing,
        recipients,
        readOnlyRecipients
      })

      await this.state.onShared({ document, recipients, readOnlyRecipients })

      await this.fetchEffectiveRecipients(
        getDocumentId(document),
        document.driveId
      )

      return sharingResult
    }

    const previewPath = this.props.previewPath ?? '/preview'

    // Pass driveId so SharingCollection delegates the creation to the drive
    // owner's instance when the document lives in a shared drive we don't own.
    const { driveId } = document

    const { data } = await this.sharingCol.create({
      document,
      recipients,
      readOnlyRecipients,
      description,
      previewPath,
      openSharing,
      sharedDrive,
      driveId
    })

    this.dispatch(
      addSharing(
        data,
        document.path || (await fetchFilesPaths(client, doctype, [document]))
      )
    )

    await this.state.onShared({ document, recipients, readOnlyRecipients })
    await this.fetchEffectiveRecipients(
      getDocumentId(document),
      document.driveId
    )
    return data
  }

  addRecipients = async ({ document, recipients, readOnlyRecipients }) => {
    const resp = await this.sharingCol.addRecipients({
      document,
      recipients,
      readOnlyRecipients
    })
    this.dispatch(updateSharing(resp.data))
  }

  renameSharedDrive = async (document, newName) => {
    const sharing = getDocumentSharing(this.state, document.id)
    await this.sharingCol.renameSharedDrive(sharing, newName)
    sharing.description = newName
    this.dispatch(updateSharing(sharing))
  }

  revokeAllRecipients = async document => {
    const { client, doctype } = this.props
    const recipients = getRecipients(this.state, document.id)
    const sharing = getDocumentSharing(this.state, document.id)

    await this.sharingCol.revokeAllRecipients(sharing)
    recipients.map(async (recipient, recipientIndex) => {
      this.dispatch(
        revokeRecipient(
          sharing,
          recipientIndex,
          document.path || (await fetchFilesPaths(client, doctype, [document]))
        )
      )
    })
    await this.fetchEffectiveRecipients(
      getDocumentId(document),
      document.driveId
    )
  }

  revoke = async (document, sharingId, recipientIndex) => {
    const { client, doctype } = this.props
    const sharing = getSharingById(this.state, sharingId)
    await this.sharingCol.revokeRecipient(sharing, recipientIndex)
    this.dispatch(
      revokeRecipient(
        sharing,
        recipientIndex,
        document.path || (await fetchFilesPaths(client, doctype, [document]))
      )
    )
    await this.fetchEffectiveRecipients(
      getDocumentId(document),
      document.driveId
    )
  }

  revokeGroup = async (document, sharingId, recipientIndex) => {
    const { client, doctype } = this.props
    const sharing = getSharingById(this.state, sharingId)
    await this.sharingCol.revokeGroup(sharing, recipientIndex)
    this.dispatch(
      revokeGroupFromState(
        sharing,
        recipientIndex,
        document.path || (await fetchFilesPaths(client, doctype, [document]))
      )
    )
  }

  revokeSelf = async document => {
    const sharing = getSharingForSelf(this.state, document.id)
    await this.sharingCol.revokeSelf(sharing)
    this.dispatch(revokeSelf(sharing))
    await this.fetchEffectiveRecipients(
      getDocumentId(document),
      document.driveId
    )
  }

  /**
   * Update a sharing member's read_only field to change permission type
   * @param {string} sharingId - The ID of the sharing
   * @param {number} memberIndex - The index of the member in the sharing members array
   * @param {string} newType - 'one-way' for read-only, 'two-way' for read-write
   * @param {object} [document] - Document whose effective recipients are refetched once updated
   */
  updateSharingMemberType = async (
    sharingId,
    memberIndex,
    newType,
    document
  ) => {
    const sharing = getSharingById(this.state, sharingId)
    if (!sharing) throw new Error('Sharing not found')

    const member = sharing.attributes.members[memberIndex]
    if (!member) throw new Error('Member not found')

    const makeReadOnly = newType === 'one-way'
    if (newType !== 'one-way' && newType !== 'two-way') {
      throw new Error('Unsupported sharing type: ' + newType)
    }

    const optimisticSharing = {
      ...sharing,
      attributes: {
        ...sharing.attributes,
        members: sharing.attributes.members.map((member, index) =>
          index === memberIndex
            ? {
                ...member,
                read_only: makeReadOnly
              }
            : member
        )
      }
    }

    this.dispatch(updateSharing(optimisticSharing))
    this.dispatch(
      updateEffectiveRecipient(sharingId, memberIndex, makeReadOnly)
    )

    try {
      if (makeReadOnly) {
        await this.sharingCol.setReadOnly(sharing, memberIndex)
      } else {
        await this.sharingCol.setReadWrite(sharing, memberIndex)
      }
    } catch (error) {
      const currentSharing = getSharingById(this.state, sharingId) || sharing
      const rollbackSharing = {
        ...currentSharing,
        attributes: {
          ...currentSharing.attributes,
          members: currentSharing.attributes.members.map((member, index) =>
            index === memberIndex
              ? {
                  ...member,
                  read_only: !makeReadOnly
                }
              : member
          )
        }
      }

      this.dispatch(updateSharing(rollbackSharing))
      this.dispatch(
        updateEffectiveRecipient(sharingId, memberIndex, !makeReadOnly)
      )
      log.error(
        `Failed to change member ${member.email} permission type to ${newType}`,
        error
      )
      throw error
    }

    if (document) {
      await this.fetchEffectiveRecipients(
        getDocumentId(document),
        document.driveId
      )
    }
  }

  fetchEffectiveRecipients = async (fileId, driveId) => {
    try {
      const resp = await this.sharingCol.fetchEffectiveRecipients(fileId, {
        driveId
      })
      this.dispatch(
        receiveEffectiveRecipients(
          fileId,
          mapEffectiveRecipients(resp?.data || [])
        )
      )
    } catch (error) {
      // The sharing was deleted (e.g. revoking the last recipient removes the
      // shared drive): clear its recipients instead of leaving a stale list
      // (linagora/twake-drive#4264).
      if (error?.status !== 404) throw error
      this.dispatch(receiveEffectiveRecipients(fileId, []))
    }
  }

  invalidateEffectiveRecipients = docId => {
    this.dispatch(invalidateEffectiveRecipients(docId))
  }

  shareByLink = async (document, options) => {
    try {
      const resp = document.driveId
        ? await this.createSharedDriveSharingLink(document, options)
        : await this.permissionCol.createSharingLink(document, options)
      this.dispatch(addSharingLink(resp.data))
      return resp
    } catch (error) {
      if (document.driveId && error && error.status === 409) {
        const permissions = await this.fetchSharedDriveSharingLinks(document)
        if (permissions && permissions.length > 0) {
          return { data: permissions[0] }
        }
      }
      throw error
    }
  }

  fetchSharingLinks = async (document, permissionCol = this.permissionCol) => {
    const documentId = getDocumentId(document)
    if (!documentId) return []

    const response = document.driveId
      ? await permissionCol.findLinksByIds([documentId])
      : await permissionCol.findLinksByDoctype(this.props.doctype)
    const permissions = (response?.data || []).filter(
      permission =>
        document.driveId || getPermissionDocIds(permission).includes(documentId)
    )
    const existingPermissions = getDocumentPermissions(this.state, documentId)
    const existingPermissionIds = existingPermissions.map(
      permission => permission.id
    )
    const newPermissions = permissions.filter(
      permission => !existingPermissionIds.includes(permission.id)
    )

    if (newPermissions.length > 0) {
      this.dispatch(addSharingLink(newPermissions))
    }

    return permissions
  }

  ensureSharingLink = async (document, linkAccess) => {
    const documentId = getDocumentId(document)
    if (!documentId) {
      throw new Error('Sharing links require a document id')
    }

    const permissions = document.driveId
      ? await this.fetchSharedDriveSharingLinks(document)
      : await this.fetchSharingLinks(document)
    const { verbs, expiresAt, ttl, password } = getLinkAccessOptions(linkAccess)
    const permissionResponse =
      permissions.length > 0
        ? (
            await this.updateDocumentPermissions(
              { ...document, id: documentId },
              { verbs, expiresAt, password },
              permissions
            )
          )[0]
        : await this.shareByLink(document, { verbs, ttl, password })
    const permission = permissionResponse?.data
    const sharecode = getShortcode(permission)

    if (!sharecode) {
      throw new Error('Sharing permission does not contain a shortcode')
    }

    return {
      documentId,
      url: generateShareLinkFromFile({
        client: this.props.client,
        file: document,
        sharecode,
        getOwner: this.state.getOwner,
        getSharingById: this.state.getSharingById,
        documentType: this.state.documentType
      })
    }
  }

  getFederatedShareLink = document => {
    if (!document?.driveId) return null

    const documentId = getDocumentId(document)
    if (!documentId) return null

    const permissions = getDocumentPermissions(this.state, documentId)
    const perm = permissions.find(p => getShortcode(p))
    if (!perm) return null

    const code = getShortcode(perm)
    if (!code) return null

    const { client } = this.props
    return generateShareLinkFromFile({
      client,
      file: document,
      sharecode: code,
      getOwner: this.state.getOwner,
      getSharingById: this.state.getSharingById,
      documentType: this.state.documentType
    })
  }

  createSharedDriveSharingLink = async (document, options) => {
    const { client } = this.props
    const drivePermissionCollection = client.collection('io.cozy.permissions', {
      driveId: document.driveId
    })
    const resp = await drivePermissionCollection.createSharingLink(
      document,
      options
    )
    return resp
  }

  fetchSharedDriveSharingLinks = async document => {
    if (!document || !document.driveId) return []

    const { client } = this.props
    const drivePermissionCollection = client.collection('io.cozy.permissions', {
      driveId: document.driveId
    })
    return this.fetchSharingLinks(document, drivePermissionCollection)
  }

  updateSharedDrivePermissions = async (
    document,
    permissionDocument,
    updatedPermissions,
    options
  ) => {
    const { client } = this.props
    const { expiresAt, password } = options
    const drivePermissionCollection = client.collection('io.cozy.permissions', {
      driveId: document.driveId
    })
    const resp = await drivePermissionCollection.add(
      permissionDocument,
      updatedPermissions,
      { expiresAt, password }
    )
    this.dispatch(updateSharingLink(resp.data))
    return resp
  }

  /**
   * updateDocumentPermissions - Description
   *
   * @param {Object} document A shared document
   * @param {object} options The new verbs to use for the permission, eg. ['GET']
   * @param {string[]} options.verbs The new verbs to use for the permission, eg. ['GET']
   * @param {string} [options.expiresAt] The new expiration date for the permission
   * @param {string} [options.password] The new password for the permission
   * @param {object[]|null} [permissionsToUpdate] Permission documents to update
   * instead of the document's permissions from state
   *
   * @return {Array}
   */
  updateDocumentPermissions = async (
    document,
    options,
    permissionsToUpdate = null
  ) => {
    const { verbs, expiresAt, password } = options
    const documentId = getDocumentId(document)
    const permissions =
      permissionsToUpdate || getDocumentPermissions(this.state, documentId)

    if (!permissions || permissions.length === 0) {
      return []
    }

    const responses = await Promise.all(
      permissions.map(async permissionDocument => {
        const updatedPermissions = Object.fromEntries(
          Object.entries(permissionDocument.attributes.permissions).map(
            ([permissionType, rules]) => [permissionType, { ...rules, verbs }]
          )
        )

        const resp = document.driveId
          ? await this.updateSharedDrivePermissions(
              document,
              permissionDocument,
              updatedPermissions,
              options
            )
          : await this.permissionCol.add(
              permissionDocument,
              updatedPermissions,
              { expiresAt, password }
            )
        this.dispatch(updateSharingLink(resp.data))
        return resp
      })
    )

    return responses
  }

  revokeSharedDriveSharingLink = async (document, perms) => {
    const { client } = this.props
    const drivePermissionCollection = client.collection('io.cozy.permissions', {
      driveId: document.driveId
    })
    await Promise.all(perms.map(p => drivePermissionCollection.destroy(p)))
  }

  revokeSharingLink = async document => {
    // Because some duplicate links have been created in the past, we must ensure
    // we revoke all of them
    const perms = getDocumentPermissions(this.state, document.id)
    if (document.driveId) {
      await this.revokeSharedDriveSharingLink(document, perms)
    } else {
      await Promise.all(perms.map(p => this.permissionCol.destroy(p)))
    }
    this.dispatch(revokeSharingLink(perms))
  }

  hasWriteAccess = (docId, driveId = undefined) => {
    const instanceUri = this.props.client.getStackClient().uri

    if (this.state.byDocId?.[docId]) {
      return (
        isOwner(this.state, docId) ||
        getSharingType(this.state, docId, instanceUri) === SHARING_TYPE.TWO_WAY
      )
    }

    if (driveId) {
      return (
        getSharedDriveSharingType(this.state, driveId, instanceUri) ===
        SHARING_TYPE.TWO_WAY
      )
    }

    return true
  }

  render() {
    // WARN: whe shouldn't do this (https://reactjs.org/docs/context.html#caveats)
    // but if we don't, consumers don't rerender when the state changes after loading the sharings,
    // probably because the state object remains the same...
    return (
      <SharingContext.Provider value={{ ...this.state }}>
        {this.props.children}
      </SharingContext.Provider>
    )
  }
}

export default withClient(SharingProvider)
