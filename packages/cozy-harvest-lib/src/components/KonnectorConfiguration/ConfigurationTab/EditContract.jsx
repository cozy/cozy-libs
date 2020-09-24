import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { useClient } from 'cozy-client'
import flag from 'cozy-flags'
import Alerter from 'cozy-ui/transpiled/react/Alerter'
import Button from 'cozy-ui/transpiled/react/Button'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import Field from 'cozy-ui/transpiled/react/Field'
import CollectionField from 'cozy-ui/transpiled/react/Labs/CollectionField'
import Stack from 'cozy-ui/transpiled/react/Stack'
import BaseContactPicker from 'cozy-ui/transpiled/react/ContactPicker'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

import Dialog, {
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogCloseButton
} from 'cozy-ui/transpiled/react/Dialog'

import SyncContractSwitch from './SyncContractSwitch'
import { findKonnectorPolicy } from '../../../konnector-policies'

import withLocales from '../../hoc/withLocales'
import { updateContract } from './helpers'

import {
  getAccountLabel,
  getAccountInstitutionLabel,
  getAccountOwners
} from './bankAccountHelpers'

const ContactPicker = props => {
  const { t } = useI18n()
  return (
    <BaseContactPicker
      listPlaceholder={t('contractForm.listPlaceholder')}
      listEmptyMessage={t('contractForm.listEmptyMessage')}
      addContactLabel={t('contractForm.addContactLabel')}
      {...props}
    />
  )
}

const DeleteConfirm = ({
  onCancel,
  onConfirm,
  title,
  description,
  secondaryText,
  primaryText
}) => {
  return (
    <Dialog>
      <DialogTitle>{title}</DialogTitle>
      <DialogCloseButton onClick={() => onCancel()} />
      <DialogContent>
        <div dangerouslySetInnerHTML={{ __html: description }} />
      </DialogContent>
      <DialogActions>
        <Button theme="secondary" label={secondaryText} onClick={onCancel} />
        <Button theme="danger" label={primaryText} onClick={onConfirm} />
      </DialogActions>
    </Dialog>
  )
}

const EditContract = props => {
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()
  const client = useClient()

  const {
    contract,
    accountId,
    konnector,
    onAfterRemove,
    onSuccess,
    dismissAction,
    onError
  } = props

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [deleting, setDeleting] = useState(false)

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

  const [shortLabel, setShortLabel] = useState(getAccountLabel(contract))
  const [owners, setOwners] = useState(getAccountOwners(contract))

  const handleSubmit = e => {
    e.preventDefault()
    handleSaveContract(contract, { shortLabel, owners })
  }

  const handleRequestDeletion = ev => {
    ev.preventDefault()
    setShowDeleteConfirmation(true)
  }

  const handleRemoveContract = async contract => {
    setDeleting(true)

    try {
      await client.destroy(contract)

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

  const confirmPrimaryText = t('contractForm.confirm-deletion.description')
  const fieldVariant = isMobile ? 'default' : 'inline'
  const policy = konnector ? findKonnectorPolicy(konnector) : null

  return (
    <Dialog>
      <DialogCloseButton onClick={dismissAction} />
      <DialogTitle>{getAccountLabel(contract)}</DialogTitle>
      <DialogContent>
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
            <CollectionField
              label={t('contractForm.owner')}
              values={owners}
              component={ContactPicker}
              addButtonLabel={t('contractForm.addOwnerBtn')}
              removeButtonLabel={t('contractForm.removeOwnerBtn')}
              variant={fieldVariant}
              onChange={owners => setOwners(owners)}
              placeholder={t('contractForm.ownerPlaceholder')}
            />
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
            {policy &&
            policy.setSync &&
            flag('harvest.toggle-contract-sync') ? (
              <SyncContractSwitch
                fieldVariant={fieldVariant}
                contract={contract}
                accountId={accountId}
                konnector={konnector}
              />
            ) : null}

            <Button
              className="u-ml-auto"
              label={t('contractForm.removeAccountBtn')}
              theme="danger-outline"
              onClick={handleRequestDeletion}
            />
          </Stack>
        </form>
      </DialogContent>
      <DialogActions layout="row">
        <Button
          label={t('contractForm.cancel')}
          theme="secondary"
          onClick={dismissAction}
        />
        <Button
          type="submit"
          form={`edit-contract-${contract._id}`}
          label={t('contractForm.apply')}
          theme="primary"
        />
      </DialogActions>
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
          onCancel={() => setShowDeleteConfirmation(false)}
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
  onCancel: PropTypes.func.isRequired,
  /** Account id (necessary to toggle contract sync) */
  accountId: PropTypes.string.isRequired,
  /** Konnector that fetched the contract (not present for disconnected accounts) */
  konnector: PropTypes.object
}

export default withLocales(EditContract)
