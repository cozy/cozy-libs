import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { getTracker } from 'cozy-ui/transpiled/react/helpers/tracker'
import { translate } from 'cozy-ui/transpiled/react/I18n'

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
  hasSharedChild
} from './state'

import SharingContext from './context'
import { default as DumbSharedBadge } from './components/SharedBadge'
import {
  default as DumbShareButton,
  SharedByMeButton,
  SharedWithMeButton
} from './components/ShareButton'
import EditableSharingModal from './components/EditableSharingModal'
import { SharingDetailsModal } from './SharingDetailsModal'
import { default as RecipientsList } from './components/WhoHasAccessLight'
import { RecipientsAvatars } from './components/Recipient'
import { default as DumbSharedStatus } from './components/SharedStatus'
import { withClient } from 'cozy-client'

import withLocales from './withLocales'

import { fetchNextPermissions } from './fetchNextPermissions'
const track = (document, action) => {
  const tracker = getTracker()
  if (!tracker) {
    return
  }
  tracker.push([
    'trackEvent',
    isFile(document) ? 'Drive' : 'Photos',
    action,
    `${action}${isFile(document) ? 'File' : 'Album'}`
  ])
}
const trackSharingByLink = document => track(document, 'shareByLink')
const isFile = ({ _type }) => _type === 'io.cozy.files'

const fixIdForSharingReceiveByRealtime = sharing => {
  return {
    id: sharing._id,
    ...sharing
  }
}
/**
 * When we receive an event for the sharing from
 * the websocket the message is not formatted as
 * the response of the api endpoint.
 *
 * Let's merge together
 * @param {*} fromHTTPRequest
 * @param {*} fromWebsocket
 */
const mergeSharing = (fromHTTPRequest, fromWebsocket) => {
  return {
    ...fromHTTPRequest,
    meta: {
      rev: fromWebsocket._rev
    },
    attributes: {
      ...fromWebsocket
    }
  }
}
export class SharingProvider extends Component {
  constructor(props, context) {
    super(props, context)
    const instanceUri = props.client.getStackClient().uri
    const documentType = props.documentType || 'Document'
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
      getRecipients: docId => getRecipients(this.state, docId),
      getDocumentPermissions: docId =>
        getDocumentPermissions(this.state, docId),
      getSharingLink: docId => getSharingLink(this.state, docId, documentType),
      hasSharedParent: document => hasSharedParent(this.state, document),
      hasSharedChild: document => hasSharedChild(this.state, document),
      share: this.share,
      revoke: this.revoke,
      revokeSelf: this.revokeSelf,
      shareByLink: this.shareByLink,
      updateDocumentPermissions: this.updateDocumentPermissions,
      revokeSharingLink: this.revokeSharingLink,
      hasLoadedAtLeastOnePage: false,
      revokeAllRecipients: this.revokeAllRecipients,
      refresh: this.fetchAllSharings,
      hasWriteAccess: this.hasWriteAccess
    }
  }

  dispatch = action =>
    this.setState(state => ({ ...state, ...reducer(state, action) }))

  componentDidMount() {
    this.fetchAllSharings()
    const { client } = this.props
    this.realtime = client.plugins.realtime
    this.type = 'io.cozy.sharings'
    this.realtime.subscribe('created', this.type, this.handleCreateOrUpdate)
    this.realtime.subscribe('updated', this.type, this.handleCreateOrUpdate)
  }

  componentWillUnmount() {
    this.realtime.unsubscribe('created', this.type, this.handleCreateOrUpdate)
    this.realtime.unsubscribe('updated', this.type, this.handleCreateOrUpdate)
  }

  handleCreateOrUpdate = async sharing => {
    const internalSharing = getSharingById(this.state, sharing._id)
    if (internalSharing) {
      const newSharing = mergeSharing(internalSharing, sharing)
      this.dispatch(updateSharing(newSharing))
    } else {
      const sharingWithId = fixIdForSharingReceiveByRealtime(sharing)
      const fakedSharing = {
        ...sharingWithId,
        attributes: { ...sharingWithId },
        type: 'io.cozy.sharings'
      }

      //TODO Check if we can getByIds to avoid query in map
      const docsId = getSharingDocIds(fakedSharing)
      docsId.map(async id => {
        const file = await this.props.client.collection('io.cozy.files').get(id)
        this.dispatch(
          addSharing(
            fakedSharing,
            file.data.path || (await this.getFilesPaths([file.data]))
          )
        )
      })
    }
  }

  fetchAllSharings = async () => {
    const { doctype, client } = this.props
    const [sharings, permissions, apps] = await Promise.all([
      client.collection('io.cozy.sharings').findByDoctype(doctype),
      client.collection('io.cozy.permissions').findLinksByDoctype(doctype),
      client.collection('io.cozy.permissions').findApps()
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
    fetchNextPermissions(permissions, this.dispatch, client)
    if (doctype !== 'io.cozy.files') return
    const sharedDocIds = getSharedDocIdsBySharings(sharings)
    const resp = await client.collection(doctype).all({ keys: sharedDocIds })
    const folderPaths = resp.data
      .filter(f => f.type === 'directory' && !f.trashed)
      .map(f => f.path)
    const filePaths = await this.getFilesPaths(
      resp.data.filter(f => f.type !== 'directory' && !f.trashed)
    )
    this.dispatch(receivePaths([...folderPaths, ...filePaths]))
  }

  getFilesPaths = async files => {
    const parentDirIds = files
      .map(f => f.dir_id)
      .filter((f, idx, arr) => arr.indexOf(f) === idx)
    const parentDirs = await this.props.client
      .collection(this.props.doctype)
      .all({ keys: parentDirIds })
    const filePaths = files.map(f => {
      const parentDirPath = parentDirs.data.find(d => d.id === f.dir_id).path
      return parentDirPath === '/' ? `/${f.name}` : `${parentDirPath}/${f.name}`
    })
    return filePaths
  }

  share = async (document, recipients, sharingType, description) => {
    const sharing = getDocumentSharing(this.state, document.id)
    if (sharing) return this.addRecipients(sharing, recipients, sharingType)
    const resp = await this.props.client
      .collection('io.cozy.sharings')
      .share(document, recipients, sharingType, description, '/preview')
    this.dispatch(
      addSharing(
        resp.data,
        document.path || (await this.getFilesPaths([document]))
      )
    )
    return resp.data
  }

  addRecipients = async (sharing, recipients, sharingType) => {
    const resp = await this.props.client
      .collection('io.cozy.sharings')
      .addRecipients(sharing, recipients, sharingType)
    this.dispatch(updateSharing(resp.data))
  }

  revokeAllRecipients = async document => {
    const recipients = getRecipients(this.state, document.id)
    const sharing = getDocumentSharing(this.state, document.id)

    await this.props.client
      .collection('io.cozy.sharings')
      .revokeAllRecipients(sharing)
    recipients.map(async (recipient, recipientIndex) => {
      this.dispatch(
        revokeRecipient(
          sharing,
          recipientIndex,
          document.path || (await this.getFilesPaths([document]))
        )
      )
    })
  }

  revoke = async (document, sharingId, recipientIndex) => {
    const sharing = getSharingById(this.state, sharingId)
    await this.props.client
      .collection('io.cozy.sharings')
      .revokeRecipient(sharing, recipientIndex)
    this.dispatch(
      revokeRecipient(
        sharing,
        recipientIndex,
        document.path || (await this.getFilesPaths([document]))
      )
    )
  }

  revokeSelf = async document => {
    const sharing = getSharingForSelf(this.state, document.id)
    await this.props.client.collection('io.cozy.sharings').revokeSelf(sharing)
    this.dispatch(revokeSelf(sharing))
  }

  shareByLink = async document => {
    trackSharingByLink(document)
    const resp = await this.props.client
      .collection('io.cozy.permissions')
      .createSharingLink(document)
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

        const resp = await this.props.client
          .collection('io.cozy.permissions')
          .add(permissionDocument, updatedPermissions)
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
    await Promise.all(
      perms.map(p =>
        this.props.client.collection('io.cozy.permissions').destroy(p)
      )
    )
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

export const SharedDocument = ({ docId, children }) => (
  <SharingContext.Consumer>
    {({
      hasWriteAccess,
      byDocId,
      isOwner,
      getRecipients,
      getSharingLink,
      refresh,
      revokeSelf
    } = {}) =>
      children({
        hasWriteAccess: hasWriteAccess(docId),
        isShared: byDocId !== undefined && byDocId[docId],
        isSharedByMe: byDocId !== undefined && byDocId[docId] && isOwner(docId),
        isSharedWithMe:
          byDocId !== undefined && byDocId[docId] && !isOwner(docId),
        recipients: getRecipients(docId),
        link: getSharingLink(docId) !== null,
        onFileDelete: refresh,
        onLeave: revokeSelf
      })
    }
  </SharingContext.Consumer>
)

export const SharedStatus = withLocales(
  ({ docId, className, noSharedClassName }) => (
    <SharingContext.Consumer>
      {({ byDocId, getRecipients, getSharingLink } = {}) =>
        !byDocId || !byDocId[docId] ? (
          <span className={className + ' ' + noSharedClassName}>—</span>
        ) : (
          <DumbSharedStatus
            className={className}
            recipients={getRecipients(docId)}
            docId={docId}
            link={getSharingLink(docId) !== null}
          />
        )
      }
    </SharingContext.Consumer>
  )
)

export const SharedBadge = withLocales(({ docId, ...rest }) => (
  <SharingContext.Consumer>
    {({ byDocId, isOwner } = {}) =>
      !byDocId || !byDocId[docId] ? null : (
        <DumbSharedBadge byMe={isOwner(docId)} {...rest} />
      )
    }
  </SharingContext.Consumer>
))

export const SharedRecipients = withLocales(({ docId, onClick, ...rest }) => (
  <SharingContext.Consumer>
    {({ byDocId, getRecipients, getSharingLink } = {}) =>
      !byDocId || !byDocId[docId] ? null : (
        <RecipientsAvatars
          recipients={getRecipients(docId)}
          link={getSharingLink(docId) !== null}
          onClick={onClick}
          {...rest}
        />
      )
    }
  </SharingContext.Consumer>
))

export const SharedRecipientsList = withLocales(({ docId, ...rest }) => (
  <SharingContext.Consumer>
    {({ byDocId, isOwner, getRecipients } = {}) =>
      !byDocId || !byDocId[docId] || !isOwner(docId) ? null : (
        <RecipientsList
          recipients={getRecipients(docId).filter(r => r.status !== 'owner')}
          {...rest}
        />
      )
    }
  </SharingContext.Consumer>
))

export const ShareButton = withLocales(
  translate()(({ t, docId, ...rest }) => (
    <SharingContext.Consumer>
      {({ byDocId, documentType, isOwner }) => {
        return !byDocId[docId] ? (
          <DumbShareButton label={t(`${documentType}.share.cta`)} {...rest} />
        ) : isOwner(docId) ? (
          <SharedByMeButton
            label={t(`${documentType}.share.sharedByMe`)}
            {...rest}
          />
        ) : (
          <SharedWithMeButton
            label={t(`${documentType}.share.sharedWithMe`)}
            {...rest}
          />
        )
      }}
    </SharingContext.Consumer>
  ))
)

ShareButton.contextTypes = {
  t: PropTypes.func.isRequired
}

const SharingModal = ({ document, ...rest }) => (
  <SharingContext.Consumer>
    {({
      documentType,
      getOwner,
      getSharingType,
      getRecipients,
      revokeSelf
    }) => (
      <SharingDetailsModal
        document={document}
        documentType={documentType}
        owner={getOwner(document.id)}
        sharingType={getSharingType(document.id)}
        recipients={getRecipients(document.id)}
        onRevoke={revokeSelf}
        {...rest}
      />
    )}
  </SharingContext.Consumer>
)

export const ShareModal = withLocales(({ document, ...rest }) => (
  <SharingContext.Consumer>
    {({ byDocId, isOwner, canReshare }) =>
      !byDocId[document.id] ||
      isOwner(document.id) ||
      canReshare(document.id) ? (
        <EditableSharingModal document={document} {...rest} />
      ) : (
        <SharingModal document={document} {...rest} />
      )
    }
  </SharingContext.Consumer>
))

/**
 * Expose a refresh method
 */
export const RefreshableSharings = ({ children }) => (
  <SharingContext.Consumer>
    {({ refresh }) =>
      children({
        refresh
      })
    }
  </SharingContext.Consumer>
)

export { SharingContext, withLocales }
