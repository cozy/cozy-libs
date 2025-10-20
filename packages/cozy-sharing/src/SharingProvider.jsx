import React, { Component } from 'react'

import { withClient } from 'cozy-client'
import minilog from 'cozy-minilog'

import SharingContext from './context'
import { fetchNextPermissions } from './fetchNextPermissions'
import { fetchFilesPaths } from './helpers/files'
import {
  getSharingObject,
  createSharingInStore,
  updateSharingInStore
} from './helpers/sharings'
import { SynchronousJobQueue } from './helpers/synchronousJobQueue'
import { fetchApps } from './queries/queries'
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
  isOwner,
  isSharedDrive,
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
  hasSharedParent,
  hasSharedChild,
  getSharedParentPath,
  getSharedDriveSharingType,
  SHARING_TYPE
} from './state'

const log = minilog('SharingProvider')
const SHARING_DOCTYPE = 'io.cozy.sharings'
const PERMISSION_DOCTYPE = 'io.cozy.permissions'

export class SharingProvider extends Component {
  constructor(props, context) {
    super(props, context)
    const instanceUri = props.client.getStackClient().uri
    const documentType = props.documentType || 'Document'
    const onShared = props.onShared || (() => {})

    this.fetchAllSharings = this.fetchAllSharings.bind(this)
    this.state = {
      byDocId: {},
      sharings: [],
      permissions: [],
      sharedFolderPaths: [],
      documentType,
      isOwner: docId => isOwner(this.state, docId),
      isSharedDrive: docId => isSharedDrive(this.state, docId),
      canReshare: docId => canReshare(this.state, docId, instanceUri),
      getOwner: docId => getOwner(this.state, docId),
      getSharingType: docId => getSharingType(this.state, docId, instanceUri),
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
      updateDocumentPermissions: this.updateDocumentPermissions,
      revokeSharingLink: this.revokeSharingLink,
      hasLoadedAtLeastOnePage: false,
      allLoaded: false,
      revokeAllRecipients: this.revokeAllRecipients,
      refresh: this.fetchAllSharings,
      hasWriteAccess: this.hasWriteAccess
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
    const [sharings, permissions, apps] = await Promise.all([
      this.sharingCol.findByDoctype(doctype, { withSharedDocs: false }),
      this.permissionCol.findLinksByDoctype(doctype),
      client.fetchQueryAndGetFromState(fetchApps())
    ])
    this.dispatch(
      receiveSharings({
        instanceUri: client.options.uri,
        sharings: sharings.data,
        permissions: permissions.data,
        apps: apps.data
      })
    )
    this.setState({ hasLoadedAtLeastOnePage: true })
    // eslint-disable-next-line promise/catch-or-return
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

      return sharingResult
    }

    const previewPath = this.props.previewPath ?? '/preview'

    const { data } = await this.sharingCol.create({
      document,
      recipients,
      readOnlyRecipients,
      description,
      previewPath,
      openSharing,
      sharedDrive
    })

    this.dispatch(
      addSharing(
        data,
        document.path || (await fetchFilesPaths(client, doctype, [document]))
      )
    )

    await this.state.onShared({ document, recipients, readOnlyRecipients })
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
  }

  shareByLink = async (document, options) => {
    const resp = await this.permissionCol.createSharingLink(document, options)
    this.dispatch(addSharingLink(resp.data))
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
   *
   * @return {Array}
   */
  updateDocumentPermissions = async (document, options) => {
    const { verbs, expiresAt, password } = options
    const permissions = getDocumentPermissions(this.state, document.id)

    const responses = await Promise.all(
      permissions.map(async permissionDocument => {
        const updatedPermissions = permissionDocument.attributes.permissions
        Object.keys(updatedPermissions).map(permType => {
          updatedPermissions[permType].verbs = verbs
        })

        const resp = await this.permissionCol.add(
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

  revokeSharingLink = async document => {
    // Because some duplicate links have been created in the past, we must ensure
    // we revoke all of them
    const perms = getDocumentPermissions(this.state, document.id)
    await Promise.all(perms.map(p => this.permissionCol.destroy(p)))
    this.dispatch(revokeSharingLink(perms))
  }

  hasWriteAccess = (docId, driveId = undefined) => {
    const instanceUri = this.props.client.getStackClient().uri

    /** Split another case for checking sharing type for shared drive
     * In case of shared drive, we just check if shared drive has write access or not.
     * All the files / folders inside must follow the sharing rule of shared drive.
     * `driveId` only exist in files / folders from recipient, so we don't need to check it belong to owner or not.
     */
    if (driveId) {
      return (
        getSharedDriveSharingType(this.state, driveId, instanceUri) ===
        SHARING_TYPE.TWO_WAY
      )
    }

    return (
      !this.state.byDocId ||
      !this.state.byDocId[docId] ||
      isOwner(this.state, docId) ||
      getSharingType(this.state, docId, instanceUri) === SHARING_TYPE.TWO_WAY
    )
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
