import { set } from 'lodash'
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import { useClient } from 'cozy-client'
import Alerter from 'cozy-ui/transpiled/react/Alerter'
import Button from 'cozy-ui/transpiled/react/Button'
import { useI18n } from 'cozy-ui/transpiled/react'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import Field from 'cozy-ui/transpiled/react/Field'
import CollectionField from 'cozy-ui/transpiled/react/Labs/CollectionField'
import Stack from 'cozy-ui/transpiled/react/Stack'
import BaseContactPicker from 'cozy-ui/transpiled/react/ContactPicker'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

import ExperimentalDialog, {
  ExperimentalDialogTitle,
  ExperimentalDialogActions
} from 'cozy-ui/transpiled/react/labs/ExperimentalDialog'

import DialogContent from 'cozy-ui/transpiled/react/MuiCozyTheme/Dialog/DialogContent'
import DialogCloseButton from 'cozy-ui/transpiled/react/MuiCozyTheme/Dialog/DialogCloseButton'

import { Media, Img } from 'cozy-ui/transpiled/react/Media'
import NarrowContent from 'cozy-ui/transpiled/react/NarrowContent'
import withLocales from '../../hoc/withLocales'

import {
  getAccountLabel,
  getAccountInstitutionLabel,
  getAccountType,
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

const EditBankAccountForm = props => {
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()

  const { account, onSubmit, onCancel, FormControlsWrapper, ...rest } = props

  const [shortLabel, setShortLabel] = useState(getAccountLabel(account))
  const [owners, setOwners] = useState(getAccountOwners(account))

  const handleSubmit = e => {
    e.preventDefault()
    onSubmit({ shortLabel, owners })
  }

  const fieldVariant = isMobile ? 'default' : 'inline'

  return (
    <form onSubmit={handleSubmit} {...rest}>
      <Stack spacing={isMobile ? 's' : 'm'}>
        <Field
          id="account-label"
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
          label={t('contractForm.bank')}
          value={getAccountInstitutionLabel(account)}
          disabled
          variant={fieldVariant}
        />
        <Field
          id="account-number"
          label={t('contractForm.number')}
          value={account.number}
          disabled
          variant={fieldVariant}
        />
        <Field
          id="account-type"
          label={t('contractForm.type')}
          value={getAccountType(account)}
          disabled
          variant={fieldVariant}
        />
      </Stack>
      <FormControlsWrapper>
        <FormControls onCancel={onCancel} t={t} />
      </FormControlsWrapper>
    </form>
  )
}

EditBankAccountForm.propTypes = {
  /** The Component used to wrap the form buttons */
  FormControlsWrapper: PropTypes.node.isRequired
}

const FormControls = props => {
  const { t } = useI18n()
  const { onCancel, form } = props

  return (
    <>
      <Button
        label={t('contractForm.cancel')}
        theme="secondary"
        onClick={onCancel}
      />
      <Button
        type="submit"
        form={form}
        label={t('contractForm.apply')}
        theme="primary"
      />
    </>
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
    <ExperimentalDialog>
      <ExperimentalDialogTitle>{title}</ExperimentalDialogTitle>
      <DialogCloseButton onClick={() => onCancel()} />
      <DialogContent>
        <div dangerouslySetInnerHTML={{ __html: description }} />
      </DialogContent>
      <ExperimentalDialogActions>
        <Button theme="secondary" label={secondaryText} onClick={onCancel} />
        <Button theme="danger" label={primaryText} onClick={onConfirm} />
      </ExperimentalDialogActions>
    </ExperimentalDialog>
  )
}

const transformDocToRelationship = doc => ({
  _id: doc._id,
  _type: doc._type
})

const updateContract = async (client, contract, options) => {
  const { fields, onSuccess, onError } = options

  Object.keys(fields).forEach(key => {
    if (key === 'owners') {
      const ownerRelationships = fields[key]
        .filter(Boolean)
        .map(transformDocToRelationship)
      set(contract, 'relationships.owners.data', ownerRelationships)
    } else {
      contract[key] = fields[key]
    }
  })

  try {
    await client.save(contract)
    onSuccess()
  } catch (err) {
    onError(err)
  }
}

const EditBankAccount = props => {
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()
  const client = useClient()

  const {
    account,
    onAfterRemove,
    onSuccess,
    onCancel,
    TitleWrapper,
    FormControlsWrapper
  } = props

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleSaveAccount = async (account, fields) => {
    await updateContract(client, account, {
      client,
      account,
      fields,
      onSuccess: () => {
        if (onSuccess) {
          onSuccess()
        }
        Alerter.success(t('contractForm.success'))
      },
      onError: err => {
        // eslint-disable-next-line no-console
        console.error(err)
        Alerter.error(t('contractForm.failure'))
      }
    })
  }

  const handleRemoveAccount = async account => {
    setDeleting(true)

    try {
      await client.destroy(account)

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

  return (
    <div
      className={cx({
        'u-pt-2': !isMobile
      })}
    >
      <TitleWrapper>{getAccountLabel(account)}</TitleWrapper>
      <Media className="u-maw-7">
        {!isMobile && (
          <Img>
            <Button
              className="u-mr-0 u-ml-auto"
              label={t('contractForm.removeAccountBtn')}
              theme="danger-outline"
              onClick={() => setShowDeleteConfirmation(true)}
            />
          </Img>
        )}
      </Media>
      <NarrowContent className={cx({ 'u-mt-2': !isMobile })}>
        <EditBankAccountForm
          FormControlsWrapper={FormControlsWrapper}
          account={account}
          onSubmit={fields => handleSaveAccount(account, fields)}
          onSuccess={onSuccess}
          onCancel={onCancel}
        />
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
            onConfirm={() => handleRemoveAccount(account)}
            onCancel={() => setShowDeleteConfirmation(false)}
          />
        ) : null}
      </NarrowContent>
    </div>
  )
}

EditBankAccount.propTypes = {
  /** The Component used to wrap the title */
  TitleWrapper: PropTypes.node.isRequired,
  /** The Component used to wrap the form buttons */
  FormControlsWrapper: PropTypes.node.isRequired
}

export default withLocales(EditBankAccount)
