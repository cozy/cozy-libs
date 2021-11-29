import React, { useCallback, useEffect, useState } from 'react'
import { FixedDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Button from 'cozy-ui/transpiled/react/Button'
import Spinner from 'cozy-ui/transpiled/react/Spinner'

import { useSafeState } from '../helpers/hooks'

/**
 * Displays a loader that can be used when ShareDialogTwoStepsConfirmationContainer is in loading state
 */
const LoadingContent = () => {
  return (
    <div className={'u-ta-center'}>
      <Spinner size="xxlarge" loadingType="sharing" />
    </div>
  )
}

/**
 * Displays an error message that can be used when ShareDialogTwoStepsConfirmationContainer is in error state
 */
const ErrorContent = () => {
  const { t } = useI18n()

  return <div>{t('Share.loadingError')}</div>
}

/**
 * Displays actions that are available when confirming a recipient
 */
const ConfirmRecipientActions = ({ confirm, reject }) => {
  const { t } = useI18n()

  return (
    <>
      <Button
        theme="danger-outline"
        label={t(`Share.twoStepsConfirmation.reject`)}
        onClick={reject}
      />
      <Button
        theme="primary"
        label={t(`Share.twoStepsConfirmation.confirm`)}
        onClick={confirm}
      />
    </>
  )
}

/**
 * Displays the reject interface that can be used when ShareDialogTwoStepsConfirmationContainer is in asking for
 * confirmation after the user clicked on Reject button
 */
const RejectDialogContent = ({ recipientConfirmationData }) => {
  const { t } = useI18n()

  const question = t('Share.twoStepsConfirmation.confirmRejection', {
    userName: recipientConfirmationData.name,
    userEmail: recipientConfirmationData.email
  })

  return question
}

/**
 * Displays actions that are available when rejecting a recipient
 */
const RejectRecipientActions = ({ reject, cancel }) => {
  const { t } = useI18n()

  return (
    <>
      <Button
        theme="secondary"
        label={t(`Share.twoStepsConfirmation.cancel`)}
        onClick={cancel}
      />
      <Button
        theme="primary"
        label={t(`Share.twoStepsConfirmation.reject`)}
        onClick={reject}
      />
    </>
  )
}

/**
 * Displays a sharing dialog that allows to share a document between multiple Cozy users
 */
const ShareDialogTwoStepsConfirmationContainer = ({
  contacts,
  createContact,
  document,
  documentType,
  groups,
  hasSharedParent,
  isOwner,
  link,
  needsContactsPermission,
  onClose,
  onRevoke,
  onRevokeLink,
  onRevokeSelf,
  onShare,
  onShareByLink,
  onUpdateShareLinkPermissions,
  permissions,
  recipients,
  sharing,
  sharingDesc,
  showShareByEmail,
  showShareOnlyByLink,
  showWhoHasAccess,
  twoStepsConfirmationMethods = {},
  dialogContentOnShare: DialogContentOnShare,
  dialogActionsOnShare: DialogActionsOnShare,
  dialogTitleOnShare: DialogTitleOnShare
}) => {
  const { t } = useI18n()

  const shouldGetRecipientsToBeConfirmed =
    twoStepsConfirmationMethods?.getRecipientsToBeConfirmed

  const [status, setStatus] = useSafeState(
    shouldGetRecipientsToBeConfirmed ? 'loading' : 'sharing'
  )
  const [recipientsToBeConfirmed, setRecipientsToBeConfirmed] = useSafeState([])
  const [recipientConfirmationData, setRecipientConfirmationData] =
    useState(undefined)

  const {
    confirmRecipient,
    rejectRecipient,
    recipientConfirmationDialogContent: ConfirmationDialogContent
  } = twoStepsConfirmationMethods

  const getRecipientsToBeConfirmed = useCallback(async () => {
    if (shouldGetRecipientsToBeConfirmed) {
      setStatus('loading')

      try {
        const result =
          await twoStepsConfirmationMethods.getRecipientsToBeConfirmed()

        setRecipientsToBeConfirmed(result)
        setStatus('sharing')
      } catch {
        setStatus('error')
      }
    } else {
      setStatus('sharing')
    }
  }, [
    shouldGetRecipientsToBeConfirmed,
    twoStepsConfirmationMethods,
    setRecipientsToBeConfirmed,
    setStatus
  ])

  useEffect(() => {
    getRecipientsToBeConfirmed()
  }, [getRecipientsToBeConfirmed])

  const showConfirmationDialog = recipientConfirmationData => {
    setRecipientConfirmationData(recipientConfirmationData)
    setStatus('confirmingRecipient')
  }

  const showRejectDialog = () => {
    setRecipientConfirmationData(recipientConfirmationData)
    setStatus('rejectingRecipient')
  }

  const onConfirmRecipient = () => {
    confirmRecipient(recipientConfirmationData).then(() => {
      getRecipientsToBeConfirmed()
    })
  }

  const onRejectRecipient = () => {
    setStatus('loading')
    rejectRecipient(recipientConfirmationData).then(() => {
      getRecipientsToBeConfirmed()
    })
  }

  const closeConfirmationDialog = () => {
    setStatus('sharing')
  }

  const closeRejectDialog = () => {
    setStatus('confirmingRecipient')
  }

  let dialogTitle = (
    <DialogTitleOnShare recipientsToBeConfirmed={recipientsToBeConfirmed} />
  )
  let dialogContent = null
  let dialogActions = null
  let onBack = null

  if (status === 'error') {
    dialogContent = <ErrorContent />
  } else if (status === 'loading') {
    dialogContent = <LoadingContent />
  } else if (status === 'sharing') {
    dialogContent = (
      <DialogContentOnShare
        contacts={contacts}
        createContact={createContact}
        document={document}
        documentType={documentType}
        groups={groups}
        hasSharedParent={hasSharedParent}
        isOwner={isOwner}
        needsContactsPermission={needsContactsPermission}
        onRevoke={onRevoke}
        onRevokeSelf={onRevokeSelf}
        onShare={onShare}
        recipients={recipients}
        sharing={sharing}
        sharingDesc={sharingDesc}
        showShareByEmail={showShareByEmail}
        showShareOnlyByLink={showShareOnlyByLink}
        showWhoHasAccess={showWhoHasAccess}
        recipientsToBeConfirmed={recipientsToBeConfirmed}
        verifyRecipient={showConfirmationDialog}
      />
    )

    dialogActions = DialogActionsOnShare ? (
      <DialogActionsOnShare
        checked={link !== null}
        document={document}
        documentType={documentType}
        link={link}
        onChangePermissions={onUpdateShareLinkPermissions}
        onDisable={onRevokeLink}
        onEnable={onShareByLink}
        permissions={permissions}
      />
    ) : null
  } else if (status === 'confirmingRecipient') {
    dialogTitle = t(`Share.twoStepsConfirmation.title`)

    dialogContent = (
      <ConfirmationDialogContent
        recipientConfirmationData={recipientConfirmationData}
      />
    )

    dialogActions = (
      <ConfirmRecipientActions
        confirm={onConfirmRecipient}
        reject={showRejectDialog}
      />
    )

    onBack = closeConfirmationDialog
  } else if (status === 'rejectingRecipient') {
    dialogTitle = t(`Share.twoStepsConfirmation.titleReject`)

    dialogContent = (
      <RejectDialogContent
        recipientConfirmationData={recipientConfirmationData}
      />
    )

    dialogActions = (
      <RejectRecipientActions
        reject={onRejectRecipient}
        cancel={closeRejectDialog}
      />
    )

    onBack = closeRejectDialog
  }

  return (
    <FixedDialog
      disableEnforceFocus
      open={true}
      onClose={onClose}
      onBack={onBack}
      title={dialogTitle}
      content={dialogContent}
      actions={dialogActions}
    />
  )
}

export default ShareDialogTwoStepsConfirmationContainer
