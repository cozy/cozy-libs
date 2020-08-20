import { set } from 'lodash'
import React, { useState } from 'react'
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
import Modal from 'cozy-ui/transpiled/react/Modal'
import { Media, Bd, Img } from 'cozy-ui/transpiled/react/Media'
import NarrowContent from 'cozy-ui/transpiled/react/NarrowContent'
import withLocales from '../../hoc/withLocales'
import { SubTitle } from 'cozy-ui/transpiled/react/Text'

import {
  getAccountLabel,
  getAccountInstitutionLabel,
  getAccountType,
  getAccountOwners
} from './bankAccountHelpers'

const ContactPicker = props => {
  const { t } = useI18n()
  // eslint-disable-next-line no-unused-vars
  const { ...rest } = props

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

  const { account, onSubmit, onCancel, ...rest } = props

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
      <FormControls onCancel={onCancel} t={t} />
    </form>
  )
}

const FormControls = props => {
  const { t } = useI18n()
  const { onCancel, form, ...rest } = props

  return (
    <div className="u-mt-2" {...rest}>
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
    </div>
  )
}

const DeleteConfirm = ({
  cancel,
  confirm,
  title,
  description,
  secondaryText,
  primaryText
}) => {
  return (
    <Modal
      title={title}
      description={<div dangerouslySetInnerHTML={{ __html: description }} />}
      secondaryType="secondary"
      secondaryText={secondaryText}
      secondaryAction={cancel}
      dismissAction={cancel}
      primaryType="danger"
      primaryText={primaryText}
      primaryAction={confirm}
    />
  )
}

const saveAccount = async params => {
  const { client, account, fields, onSuccess, onError } = params

  Object.keys(fields).forEach(key => {
    if (key === 'owners') {
      set(
        account,
        'relationships.owners.data',
        fields[key].map(owner => ({
          _id: owner._id,
          _type: owner._type
        }))
      )
      return
    }

    account[key] = fields[key]
  })

  try {
    await client.save(account)
    onSuccess()
  } catch (err) {
    onError(err)
  }
}

const EditBankAccount = props => {
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()
  const client = useClient()

  const { account, onAfterRemove, onSuccess, onCancel, TitleComponent } = props

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleSaveAccount = async (account, fields) => {
    await saveAccount({
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
      <Media className="u-maw-7">
        <Bd>
          <TitleComponent>{getAccountLabel(account)}</TitleComponent>
        </Bd>
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
            confirm={() => handleRemoveAccount(account)}
            cancel={() => setShowDeleteConfirmation(false)}
          />
        ) : null}
      </NarrowContent>
    </div>
  )
}

EditBankAccount.defaultProps = {
  TitleComponent: SubTitle
}

export default withLocales(EditBankAccount)
