import PropTypes from 'prop-types'
import React, { useState, forwardRef } from 'react'

import {
  useClient,
  isQueryLoading,
  hasQueryBeenLoaded,
  useQuery
} from 'cozy-client'
import BaseContactPicker from 'cozy-ui/transpiled/react/ContactPicker'
import {
  DialogCloseButton,
  DialogBackButton,
  ConfirmDialog,
  useCozyDialog
} from 'cozy-ui/transpiled/react/CozyDialogs'
import Dialog, {
  DialogContent,
  DialogTitle
} from 'cozy-ui/transpiled/react/Dialog'
import Divider from 'cozy-ui/transpiled/react/Divider'
import Field from 'cozy-ui/transpiled/react/Field'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Icon from 'cozy-ui/transpiled/react/Icon'
import TrashIcon from 'cozy-ui/transpiled/react/Icons/Trash'
import CollectionField from 'cozy-ui/transpiled/react/Labs/CollectionField'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import Stack from 'cozy-ui/transpiled/react/Stack'
import Alerter from 'cozy-ui/transpiled/react/deprecated/Alerter'
import Button from 'cozy-ui/transpiled/react/deprecated/Button'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import { withStyles } from 'cozy-ui/transpiled/react/styles'

import SyncContractSwitch from './SyncContractSwitch'
import {
  getAccountLabel,
  getAccountInstitutionLabel,
  getAccountOwners
} from './bankAccountHelpers'
import { updateContract } from './helpers'
import { buildAppsByIdQuery } from '../../../helpers/queries'
import { findKonnectorPolicy } from '../../../konnector-policies'
import { useTracker, useTrackPage } from '../../hoc/tracking'
import withLocales from '../../hoc/withLocales'

const EditContractContactPicker = function (props, ref) {
  const { t } = useI18n()
  return (
    <BaseContactPicker
      ref={ref}
      listPlaceholder={t('contractForm.listPlaceholder')}
      listEmptyMessage={t('contractForm.listEmptyMessage')}
      addContactLabel={t('contractForm.addContactLabel')}
      {...props}
    />
  )
}
const ContactPicker = forwardRef(EditContractContactPicker)

const NonGrowingDialogContent = withStyles({
  root: {
    flexGrow: 0
  }
})(DialogContent)

const DeleteConfirm = ({
  onCancel,
  onConfirm,
  title,
  description,
  secondaryText,
  primaryText
}) => {
  return (
    <ConfirmDialog
      open
      onClose={onCancel}
      title={title}
      content={<div dangerouslySetInnerHTML={{ __html: description }} />}
      actions={
        <>
          <Button theme="secondary" label={secondaryText} onClick={onCancel} />
          <Button theme="danger" label={primaryText} onClick={onConfirm} />
        </>
      }
    />
  )
}

const EditContract = props => {
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()
  const client = useClient()
  const tracker = useTracker()

  const {
    contract,
    accountId,
    konnector,
    onAfterRemove,
    onSuccess,
    onClose,
    onError
  } = props

  useTrackPage('editer_contrat')
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [shortLabel, setShortLabel] = useState(getAccountLabel(contract))
  const [owners, setOwners] = useState(getAccountOwners(contract))
  const { dialogProps, dialogTitleProps } = useCozyDialog({
    size: 'medium',
    open: true,
    onClose
  })

  const contactsAppQuery = buildAppsByIdQuery('contacts')
  const contactsAppResult = useQuery(
    contactsAppQuery.definition,
    contactsAppQuery.options
  )

  const isContactsAppInstalled =
    hasQueryBeenLoaded(contactsAppResult) &&
    contactsAppResult.fetchStatus === 'loaded'

  const handleSaveContract = async (contract, fields) => {
    await updateContract(client, contract, {
      client,
      contract,
      fields,
      onSuccess: () => {
        if (onSuccess) {
          onSuccess()
        }
        Alerter.success(t('contractForm.success'))
      },
      onError: err => {
        if (onError) {
          onError(err)
        }
        // eslint-disable-next-line no-console
        console.error(err)
        Alerter.error(t('contractForm.failure'))
      }
    })
  }

  const handleSubmit = e => {
    e.preventDefault()
    handleSaveContract(contract, { shortLabel, owners })
    tracker.trackEvent({ name: 'appliquer' })
  }

  const handleRequestDeletion = ev => {
    ev.preventDefault()
    setShowDeleteConfirmation(true)
    tracker.trackEvent({ name: 'supprimer_compte' })
  }

  const handleCancelDeletion = () => {
    setShowDeleteConfirmation(false)
    tracker.trackEvent({ name: 'annuler' })
  }

  const handleRemoveContract = async contract => {
    setDeleting(true)

    try {
      await client.destroy(contract)
      tracker.trackEvent({ name: 'confirmer_suppression' })

      if (onAfterRemove) {
        onAfterRemove()
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      Alerter.error(t('contractForm.deletion_error'))
    } finally {
      setDeleting(false)
    }
  }

  const handleChangeOwners = owners => {
    setOwners(owners)
    tracker.trackEvent({ name: 'changement_titulaire' })
  }

  const confirmPrimaryText = t('contractForm.confirm-deletion.description')
  const fieldVariant = isMobile ? 'default' : 'inline'
  const policy = konnector ? findKonnectorPolicy(konnector) : null

  return (
    <Dialog {...dialogProps}>
      <DialogCloseButton onClick={onClose} />
      <DialogTitle {...dialogTitleProps}>
        {isMobile ? <DialogBackButton onClick={onClose} /> : null}
        {getAccountLabel(contract)}
      </DialogTitle>
      <Divider />
      {isQueryLoading(contactsAppResult) ? (
        <Spinner
          className="u-h-100 u-flex u-flex-items-center u-flex-justify-center"
          size="xxlarge"
        />
      ) : (
        <NonGrowingDialogContent className="u-pb-1">
          <form id={`edit-contract-${contract._id}`} onSubmit={handleSubmit}>
            <Stack spacing={isMobile ? 's' : 'm'}>
              <Field
                id="account-label"
                placeholder={t('contractForm.label')}
                label={t('contractForm.label')}
                value={shortLabel}
                onChange={e => setShortLabel(e.target.value)}
                variant={fieldVariant}
              />
              {isContactsAppInstalled && (
                <CollectionField
                  label={t('contractForm.owner')}
                  values={owners && owners.length > 0 ? owners : [null]}
                  component={ContactPicker}
                  addButtonLabel={t('contractForm.addOwnerBtn')}
                  removeButtonLabel={t('contractForm.removeOwnerBtn')}
                  variant={fieldVariant}
                  onChange={handleChangeOwners}
                  placeholder={t('contractForm.ownerPlaceholder')}
                />
              )}
              <Field
                id="account-institution"
                placeholder={t('contractForm.bank')}
                label={t('contractForm.bank')}
                value={getAccountInstitutionLabel(contract)}
                disabled
                variant={fieldVariant}
              />
              <Field
                id="account-number"
                placeholder={t('contractForm.number')}
                label={t('contractForm.number')}
                value={contract.number}
                disabled
                variant={fieldVariant}
              />
              <Button
                type="submit"
                form={`edit-contract-${contract._id}`}
                label={t('contractForm.apply')}
                theme="primary"
                className="u-ml-0"
              />
            </Stack>
          </form>
        </NonGrowingDialogContent>
      )}
      <Divider />
      {policy && policy.setSync ? (
        <>
          <NonGrowingDialogContent className="u-pv-1">
            <SyncContractSwitch
              fieldVariant={fieldVariant}
              contract={contract}
              accountId={accountId}
              konnector={konnector}
            />
          </NonGrowingDialogContent>
          <Divider />
        </>
      ) : null}
      <DialogContent className="u-pv-1">
        <Button
          className="u-ml-auto u-error u-ml-0 u-ph-half"
          icon={<Icon icon={TrashIcon} />}
          theme="text"
          label={t('contractForm.removeAccountBtn')}
          onClick={handleRequestDeletion}
        />
      </DialogContent>
      {showDeleteConfirmation ? (
        <DeleteConfirm
          title={t('contractForm.confirm-deletion.title')}
          description={confirmPrimaryText}
          primaryText={
            deleting ? (
              <Spinner color="white" />
            ) : (
              t('contractForm.confirm-deletion.confirm')
            )
          }
          secondaryText={t('contractForm.cancel')}
          onConfirm={() => handleRemoveContract(contract)}
          onCancel={() => handleCancelDeletion()}
        />
      ) : null}
    </Dialog>
  )
}

EditContract.propTypes = {
  /** The account that will be edited */
  contract: PropTypes.object.isRequired,
  /** The callback called when the document is saved */
  onSuccess: PropTypes.func.isRequired,
  /** The callback called when edition is cancelled */
  onClose: PropTypes.func.isRequired,
  /** Account id (necessary to toggle contract sync, not present for disconnected accounts) */
  accountId: PropTypes.string,
  /** Konnector that fetched the contract (not present for disconnected accounts) */
  konnector: PropTypes.object
}

export default withLocales(EditContract)
