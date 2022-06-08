import React, { useState, useMemo, useCallback } from 'react'
import cx from 'classnames'
import throttle from 'lodash/throttle'

import { isIOS } from 'cozy-device-helper'
import DialogActions from 'cozy-ui/transpiled/react/DialogActions'
import Button from 'cozy-ui/transpiled/react/Buttons'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import useEventListener from 'cozy-ui/transpiled/react/hooks/useEventListener'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

import { useFormData } from '../Hooks/useFormData'
import { useStepperDialog } from '../Hooks/useStepperDialog'
import CompositeHeader from '../CompositeHeader/CompositeHeader'
import InputDateAdapter from '../ModelSteps/widgets/InputDateAdapter'
import InputTextAdapter from '../ModelSteps/widgets/InputTextAdapter'
import IlluGenericInputText from '../../assets/icons/IlluGenericInputText.svg'
import IlluGenericInputDate from '../../assets/icons/IlluGenericInputDate.svg'
import { hasNextvalue } from '../../utils/hasNextvalue'
import { KEYS } from '../../constants/const'

const Information = ({ currentStep }) => {
  const { t } = useI18n()
  const { illustration, text, attributes } = currentStep
  const { formData, setFormData } = useFormData()
  const { nextStep } = useStepperDialog()
  const [value, setValue] = useState({})
  const [validInput, setValidInput] = useState({})
  const [isFocus, setIsFocus] = useState(false)
  const { isMobile } = useBreakpoints()

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

  const inputs = useMemo(
    () =>
      attributes
        ? attributes.map(attrs => {
            switch (attrs.type) {
              case 'date':
                return function InputDate(props) {
                  return (
                    <InputDateAdapter
                      attrs={attrs}
                      defaultValue={formData.metadata[attrs.name]}
                      setValue={setValue}
                      setValidInput={setValidInput}
                      setIsFocus={setIsFocus}
                      {...props}
                    />
                  )
                }
              default:
                return function InputText(props) {
                  return (
                    <InputTextAdapter
                      attrs={attrs}
                      defaultValue={formData.metadata[attrs.name]}
                      setValue={setValue}
                      setValidInput={setValidInput}
                      setIsFocus={setIsFocus}
                      {...props}
                    />
                  )
                }
            }
          })
        : [],
    [attributes, formData.metadata]
  )

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
    <>
      <CompositeHeader
        icon={illustration}
        iconSize="medium"
        className={isFocus && isIOS() ? 'is-focused' : ''}
        fallbackIcon={fallbackIcon}
        title={t(text)}
        text={inputs.map((Input, idx) => (
          <div
            key={idx}
            className={cx({
              'u-mh-1': !isMobile,
              ['u-h-3 u-pb-1-half']: hasMarginBottom(idx)
            })}
          >
            <Input idx={idx} />
          </div>
        ))}
      />
      <DialogActions
        disableSpacing
        className={cx('columnLayout u-mb-1-half u-mt-0 cozyDialogActions', {
          'u-mh-1': !isMobile,
          'u-mh-0': isMobile
        })}
      >
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
      </DialogActions>
    </>
  )
}

export default React.memo(Information)
