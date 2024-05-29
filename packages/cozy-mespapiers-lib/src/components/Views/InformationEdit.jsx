import cx from 'classnames'
import get from 'lodash/get'
import React, { useState } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router-dom'

import { useClient } from 'cozy-client'
import { isIOS } from 'cozy-device-helper'
import Button from 'cozy-ui/transpiled/react/Buttons'
import { FixedDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import IlluGenericInputDate from '../../assets/icons/IlluGenericInputDate.svg'
import IlluGenericInputText from '../../assets/icons/IlluGenericInputText.svg'
import { BILLS_DOCTYPE, FILES_DOCTYPE } from '../../doctypes'
import { makeInputsInformationStep } from '../../helpers/makeInputsInformationStep'
import CompositeHeader from '../CompositeHeader/CompositeHeader'
import { useScannerI18n } from '../Hooks/useScannerI18n'
import {
  isInformationEditPermitted,
  updateFileMetadata
} from '../ModelSteps/Edit/helpers'
import styles from '../ModelSteps/Edit/styles.styl'
import { useCurrentEditInformations } from '../ModelSteps/Edit/useCurrentEditInformations'

const InformationEdit = () => {
  const { fileId } = useParams()
  const client = useClient()
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()
  const scannerT = useScannerI18n()
  const navigate = useNavigate()

  const [value, setValue] = useState({})
  const [validInput, setValidInput] = useState({})
  const [isFocus, setIsFocus] = useState(false)
  const [isBusy, setIsBusy] = useState(false)

  const currentEditInformations = useCurrentEditInformations(
    fileId,
    'information'
  )
  const metadataName = currentEditInformations?.searchParams?.metadataName
  const currentAttributes = currentEditInformations?.currentStep?.attributes
  const isBillsInformation =
    currentEditInformations.currentStep?.doctype === BILLS_DOCTYPE

  const defaultValue = get(
    currentEditInformations,
    isBillsInformation
      ? `file.bills.data[0].${metadataName}`
      : `file.metadata.${metadataName}`
  )
  const { Component, attrs } =
    makeInputsInformationStep(currentAttributes)[0] || {}
  const dialogTitle = currentEditInformations?.paperDef?.label
    ? scannerT(`items.${currentEditInformations.paperDef.label}`)
    : ''

  const onClose = () => {
    navigate('..')
  }

  const onConfirm = async () => {
    setIsBusy(true)

    if (isBillsInformation) {
      const bill = currentEditInformations.file.bills.data[0]
      const newBill = { ...bill, ...value }
      // we have to duplicate `employer` into `vendor` attribute to work with Banks
      if (metadataName === 'employer') {
        newBill.vendor = value[metadataName]
      }

      await client.save(newBill)
    } else {
      let newMetadata = updateFileMetadata({
        file: currentEditInformations.file,
        type: currentAttributes[0].type,
        metadataName: metadataName,
        value
      })

      await client
        .collection(FILES_DOCTYPE)
        .updateMetadataAttribute(fileId, newMetadata)
    }

    navigate('..')
  }

  if (
    !currentEditInformations.isLoading &&
    !isInformationEditPermitted(currentEditInformations)
  ) {
    return <Navigate to=".." />
  }

  const fallbackIcon =
    attrs?.[0]?.type === 'date' ? IlluGenericInputDate : IlluGenericInputText

  const text = attrs?.editText
    ? t(attrs.editText)
    : currentEditInformations.currentStep?.text
    ? t(currentEditInformations.currentStep.text)
    : null

  return (
    <FixedDialog
      open
      onClose={onClose}
      title={dialogTitle}
      content={
        <div
          className={cx(styles['InformationEdit-Dialog-container'], {
            'is-focused': isFocus && isIOS()
          })}
        >
          {currentEditInformations.isLoading ? (
            <Spinner size="xlarge" />
          ) : (
            <CompositeHeader
              icon={currentEditInformations.currentStep?.illustration}
              fallbackIcon={fallbackIcon}
              iconSize="medium"
              title={text}
              text={
                <div
                  className={cx('u-mt-1', {
                    'u-mh-1': !isMobile,
                    ['u-stack-m']: attrs.options
                  })}
                >
                  {Component && (
                    <Component
                      attrs={attrs}
                      currentDefinition={currentEditInformations.paperDef}
                      formDataValue={defaultValue}
                      setValue={setValue}
                      setValidInput={setValidInput}
                      onFocus={setIsFocus}
                      idx={0}
                    />
                  )}
                </div>
              }
            />
          )}
        </div>
      }
      actions={
        <Button
          label={t('common.apply')}
          onClick={onConfirm}
          fullWidth
          disabled={!validInput[0]}
          busy={isBusy}
        />
      }
    />
  )
}

export default InformationEdit
