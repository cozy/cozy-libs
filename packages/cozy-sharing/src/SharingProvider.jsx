import React, { Component } from 'react'

import { withClient } from 'cozy-client'

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
  revokeSelf,
  receivePaths,
  isOwner,
  canReshare,
  getOwner,
  getRecipients,
  getSharingById,
  getSharingDocIds,
  getSharingForSelf,
  getSharingType,
  getSharingLink,
  getSharedDocIdsBySharings,
  getDocumentSharing,
  getDocumentPermissions,
  hasSharedParent,
  hasSharedChild,
  getSharedParentPath
} from './state'

const SHARING_DOCTYPE = 'io.cozy.sharings'
const PERMISSION_DOCTYPE = 'io.cozy.permissions'

export class SharingProvider extends Component {
  constructor(props, context) {
    super(props, context)
    const instanceUri = props.client.getStackClient().uri
    const documentType = props.documentType || 'Document'
    const onShared = props.onShared || (() => {})
    this.state = {
      byDocId: {},
      sharings: [],
      permissions: [],
      sharedFolderPaths: [],
      documentType,
      isOwner: docId => isOwner(this.state, docId),
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
    this.realtime = null
    this.isInitialized = false

    this.synchronousJobQueue = new SynchronousJobQueue()

    const { client } = props
    this.sharingCol = client.collection(SHARING_DOCTYPE)
    this.permissionCol = client.collection(PERMISSION_DOCTYPE)

    this.fetchAllSharings = this.fetchAllSharings.bind(this)
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
      const docsId = getSharingDocIds(newSharing)
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
    const { doctype, client } = this.props
    const [sharings, permissions, apps] = await Promise.all([
      this.sharingCol.findByDoctype(doctype),
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
    openSharing
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
      openSharing
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
   * @param {Array} newVerbs The new verbs to use for the permission, eg. ['GET']
   *
   * @return {Array}
   */
  updateDocumentPermissions = async (document, newVerbs) => {
    const permissions = getDocumentPermissions(this.state, document.id)

    const responses = await Promise.all(
      permissions.map(async permissionDocument => {
        const updatedPermissions = permissionDocument.attributes.permissions
        Object.keys(updatedPermissions).map(permType => {
          updatedPermissions[permType].verbs = newVerbs
        })

        const resp = await this.permissionCol.add(
          permissionDocument,
          updatedPermissions
        )
        this.dispatch(updateSharingLink(resp))
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

  hasWriteAccess = docId => {
    const instanceUri = this.props.client.getStackClient().uri

    return (
      !this.state.byDocId ||
      !this.state.byDocId[docId] ||
      isOwner(this.state, docId) ||
      getSharingType(this.state, docId, instanceUri) === 'two-way'
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
