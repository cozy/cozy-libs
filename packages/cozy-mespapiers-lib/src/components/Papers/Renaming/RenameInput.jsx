import React, { useEffect, useReducer, useRef, useState } from 'react'
import PropTypes from 'prop-types'

import { useClient, models } from 'cozy-client'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import makeStyles from 'cozy-ui/transpiled/react/helpers/makeStyles'
import { ConfirmDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import Input from 'cozy-ui/transpiled/react/Input'
import InputGroup from 'cozy-ui/transpiled/react/InputGroup'
import Button from 'cozy-ui/transpiled/react/Buttons'
import Spinner from 'cozy-ui/transpiled/react/Spinner'

import { KEYS } from '../../../constants/const'
import { renameFile } from './helpers'

const { splitFilename } = models.file

const useStyles = makeStyles({
  inputGroup: {
    maxWidth: 'none',
    height: '2rem',
    margin: '1rem 1rem 1rem 0',
    '& > div': {
      display: 'flex'
    },
    '& input': {
      maxWidth: 'none',
      padding: '.3125rem'
    }
  },
  spinner: {
    margin: '.4375rem'
  }
})

const RenameInput = ({ file, onClose }) => {
  const client = useClient()
  const { t } = useI18n()
  const styles = useStyles()
  const textInput = useRef()
  const [isBusy, toggleBusy] = useReducer(prev => !prev, false)
  const [isModalOpened, setIsModalOpened] = useState(false)
  const defaultValue = file.name

  const handleKeyDown = async event => {
    if (event.key === KEYS.ENTER) {
      await check()
    } else if (event.key === KEYS.ESCAPE) {
      await cancel()
    }
  }

  const handleBlur = async () => {
    // On top of "normal" blurs, the event happens all the time after a submit or a cancel, because this component is removed from the DOM while having the focus.
    // we want to do things only on "normal" blurs, *not* after a cancel
    if (!isModalOpened && !isBusy) {
      await check()
    }
  }

  const check = async () => {
    const { value } = textInput.current
    if (value === '' || value === '.' || value === '..') {
      await submit()
      return
    }
    const oldExtension = splitFilename({
      name: defaultValue,
      type: 'file'
    }).extension
    const newExtension = splitFilename({
      name: value,
      type: 'file'
    }).extension
    if (oldExtension === newExtension) {
      await submit()
      return
    }
    setIsModalOpened(true)
  }

  const submit = async () => {
    const { value } = textInput.current
    await close(value)
  }

  const cancel = async () => {
    await close(defaultValue)
  }

  const close = async value => {
    toggleBusy()
    if (value !== defaultValue) {
      await renameFile(client, file, value)
    }
    onClose()
  }

  useEffect(() => {
    const { length } = splitFilename({
      name: defaultValue,
      type: 'file'
    }).filename
    textInput.current.setSelectionRange(0, length)
  }, [defaultValue])

  return (
    <InputGroup className={styles.inputGroup}>
      <Input
        ref={textInput}
        type="text"
        defaultValue={defaultValue}
        autoFocus
        disabled={isModalOpened || isBusy}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      />
      {(isModalOpened || isBusy) && <Spinner className={styles.spinner} />}
      <ConfirmDialog
        open={isModalOpened}
        onClose={cancel}
        title={t('RenameModal.title')}
        content={t('RenameModal.content')}
        actions={
          <>
            <Button
              variant="secondary"
              label={t('RenameModal.cancel')}
              onClick={cancel}
            />
            <Button label={t('RenameModal.submit')} onClick={submit} />
          </>
        }
      />
    </InputGroup>
  )
}

RenameInput.propTypes = {
  file: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired
}

export default RenameInput
