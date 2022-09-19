import React, { useState } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router-dom'
import cx from 'classnames'

import { isIOS } from 'cozy-device-helper'
import { useClient } from 'cozy-client'
import Button from 'cozy-ui/transpiled/react/Buttons'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import { Dialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import { FILES_DOCTYPE } from '../../../doctypes'
import { useScannerI18n } from '../../Hooks/useScannerI18n'
import CompositeHeaderImage from '../../CompositeHeader/CompositeHeaderImage'
import IlluGenericInputText from '../../../assets/icons/IlluGenericInputText.svg'
import { makeInputsInformationStep } from '../../../helpers/makeInputsInformationStep'
import { useCurrentEditInformation } from './useCurrentEditInformation'
import { isInformationEditPermitted, updateFileMetadata } from './helpers'

import styles from './styles.styl'

const InformationEditWrapper = () => {
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

  const currentEditInformation = useCurrentEditInformation(fileId)

  const onClose = () => {
    navigate(currentEditInformation.searchParams.backgroundPath)
  }

  const onConfirm = async () => {
    setIsBusy(true)
    let newMetadata = updateFileMetadata({
      file: currentEditInformation.file,
      type: currentEditInformation.currentStep.attributes[0].type,
      metadataName: currentEditInformation.searchParams.metadataName,
      value
    })

    await client
      .collection(FILES_DOCTYPE)
      .updateMetadataAttribute(fileId, newMetadata)

    navigate(currentEditInformation.searchParams.backgroundPath || '/paper')
  }

  const currentAttributes = currentEditInformation?.currentStep?.attributes

  const { Component, attrs } =
    makeInputsInformationStep(currentAttributes)[0] || {}

  const dialogTitle = currentEditInformation?.paperDef?.label
    ? scannerT(`items.${currentEditInformation.paperDef.label}`)
    : ''

  if (
    !currentEditInformation.isLoading &&
    !isInformationEditPermitted(currentEditInformation)
  ) {
    return <Navigate to={currentEditInformation.searchParams.backgroundPath} />
  }

  return (
    <Dialog
      open
      onClose={onClose}
      title={dialogTitle}
      content={
        <div
          className={cx(styles['InformationEditWrapper-Dialog-container'], {
            'is-focused': isFocus && isIOS()
          })}
        >
          {currentEditInformation.isLoading ? (
            <Spinner size="xlarge" />
          ) : (
            <>
              <CompositeHeaderImage
                icon={currentEditInformation.currentStep?.illustration}
                fallbackIcon={IlluGenericInputText}
                iconSize="medium"
              />
              <div
                className={cx('u-mt-1', {
                  'u-mh-1': !isMobile
                })}
              >
                {Component && (
                  <Component
                    attrs={attrs}
                    defaultValue={
                      currentEditInformation.file.metadata[
                        currentEditInformation.searchParams.metadataName
                      ]
                    }
                    setValue={setValue}
                    setValidInput={setValidInput}
                    setIsFocus={setIsFocus}
                    idx={0}
                  />
                )}
              </div>
            </>
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

export default InformationEditWrapper
