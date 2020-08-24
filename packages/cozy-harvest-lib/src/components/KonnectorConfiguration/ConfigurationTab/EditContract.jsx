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
} from 'cozy-ui/transpiled/react/Labs/ExperimentalDialog'

import DialogContent from 'cozy-ui/transpiled/react/MuiCozyTheme/Dialog/DialogContent'
import DialogCloseButton from 'cozy-ui/transpiled/react/MuiCozyTheme/Dialog/DialogCloseButton'

import { Media, Img } from 'cozy-ui/transpiled/react/Media'
import NarrowContent from 'cozy-ui/transpiled/react/NarrowContent'
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

const EditContractForm = props => {
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()

  const {
    account,
    onSuccess, // eslint-disable-line no-unused-vars
    onSubmit,
    onCancel,
    FormControlsWrapper,
    ...rest
  } = props

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
          value={getAccountInstitutionLabel(account)}
          disabled
          variant={fieldVariant}
        />
        <Field
          id="account-number"
          placeholder={t('contractForm.number')}
          label={t('contractForm.number')}
          value={account.number}
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

EditContractForm.propTypes = {
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

const EditContract = props => {
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()
  const client = useClient()

  const {
    account,
    onAfterRemove,
    onSuccess,
    onCancel,
    onError,
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
        if (onError) {
          onError()
        }
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
        <EditContractForm
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

EditContract.propTypes = {
  /** The account that will be edited */
  account: PropTypes.object.isRequired,
  /** The Component used to wrap the title */
  TitleWrapper: PropTypes.node.isRequired,
  /** The Component used to wrap the form buttons */
  FormControlsWrapper: PropTypes.node.isRequired,
  /** The callback called when the document is saved */
  onSuccess: PropTypes.func.isRequired,
  /** The callback called when edition is cancelled */
  onCancel: PropTypes.func.isRequired
}

export default withLocales(EditContract)
