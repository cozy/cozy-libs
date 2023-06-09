import cx from 'classnames'
import throttle from 'lodash/throttle'
import PropTypes from 'prop-types'
import React, { useCallback, useMemo, useState } from 'react'

import { isIOS } from 'cozy-device-helper'
import Button from 'cozy-ui/transpiled/react/Buttons'
import { Dialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import useEventListener from 'cozy-ui/transpiled/react/hooks/useEventListener'

import IlluGenericInputDate from '../../assets/icons/IlluGenericInputDate.svg'
import IlluGenericInputText from '../../assets/icons/IlluGenericInputText.svg'
import { KEYS } from '../../constants/const'
import { makeInputsInformationStep } from '../../helpers/makeInputsInformationStep'
import { hasNextvalue } from '../../utils/hasNextvalue'
import CompositeHeader from '../CompositeHeader/CompositeHeader'
import { useFormData } from '../Hooks/useFormData'
import { useStepperDialog } from '../Hooks/useStepperDialog'
import StepperDialogTitle from '../StepperDialog/StepperDialogTitle'

const InformationDialog = ({ currentStep, onClose, onBack }) => {
  const {
    illustration,
    illustrationSize = 'medium',
    text,
    attributes
  } = currentStep
  const { t } = useI18n()
  const { currentStepIndex } = useStepperDialog()
  const { formData, setFormData } = useFormData()
  const { nextStep } = useStepperDialog()
  const [value, setValue] = useState({})
  const [validInput, setValidInput] = useState({})
  const [isFocus, setIsFocus] = useState(false)

  const submit = throttle(() => {
    if (value && allInputsValid) {
      setFormData(prev => ({
        ...prev,
        metadata: {
          ...prev.metadata,
          ...value
        }
      }))
      nextStep()
    }
  }, 100)

  const handleKeyDown = useCallback(
    evt => {
      if (evt.key === KEYS.ENTER) submit()
    },
    [submit]
  )

  useEventListener(window, 'keydown', handleKeyDown)

  const inputs = makeInputsInformationStep(attributes)

  const hasMarginBottom = useCallback(
    idx => hasNextvalue(idx, inputs),
    [inputs]
  )

  const allInputsValid = useMemo(
    () => Object.keys(validInput).every(val => validInput[val]),
    [validInput]
  )
  const fallbackIcon =
    attributes?.[0]?.type === 'date'
      ? IlluGenericInputDate
      : IlluGenericInputText

  return (
    <Dialog
      open
      {...(currentStepIndex > 1 && { transitionDuration: 0 })}
      onClose={onClose}
      onBack={onBack}
      componentsProps={{
        dialogTitle: {
          className: 'u-flex u-flex-justify-between u-flex-items-center'
        }
      }}
      title={<StepperDialogTitle />}
      content={
        <CompositeHeader
          icon={illustration}
          iconSize={illustrationSize}
          className={isFocus && isIOS() ? 'is-focused' : ''}
          fallbackIcon={fallbackIcon}
          title={t(text)}
          text={inputs.map(({ Component, attrs }, idx) => (
            <div
              key={idx}
              className={cx('u-mh-1', {
                ['u-h-3 u-pb-1-half']: hasMarginBottom(idx)
              })}
            >
              <Component
                attrs={attrs}
                defaultValue={formData.metadata[attrs.name]}
                setValue={setValue}
                setValidInput={setValidInput}
                setIsFocus={setIsFocus}
                idx={idx}
              />
            </div>
          ))}
        />
      }
      actions={
        <Button
          label={t('common.next')}
          onClick={submit}
          fullWidth
          onTouchEnd={evt => {
            evt.preventDefault()
            submit()
          }}
          disabled={!allInputsValid}
        />
      }
    />
  )
}

InformationDialog.propTypes = {
  currentStep: PropTypes.shape({
    illustration: PropTypes.string,
    illustrationSize: PropTypes.string,
    text: PropTypes.string,
    attributes: PropTypes.arrayOf(PropTypes.object)
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onBack: PropTypes.func
}

export default InformationDialog
