import React, { useState, useRef } from 'react'
import { useParams } from 'react-router-dom'

import Button from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'
import PaperplaneIcon from 'cozy-ui/transpiled/react/Icons/Paperplane'
import StopIcon from 'cozy-ui/transpiled/react/Icons/Stop'
import SearchBar from 'cozy-ui/transpiled/react/SearchBar'
import Typography from 'cozy-ui/transpiled/react/Typography'
import useEventListener from 'cozy-ui/transpiled/react/hooks/useEventListener'
import { useBreakpoints } from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import ChatModes from './ConversationChips'
import styles from './styles.styl'
import { useAssistant } from '../AssistantProvider'

const ConversationBar = ({ assistantStatus, hasConversationStarted }) => {
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()
  const { onAssistantExecute } = useAssistant()
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef()
  const { conversationId } = useParams()

  // to adjust input height for multiline when typing in it
  useEventListener(inputRef.current, 'input', () => {
    inputRef.current.style.height = 'auto' // to resize input when emptying it
    inputRef.current.style.height = `${inputRef.current.scrollHeight}px`
  })

  const handleClear = () => {
    setInputValue('')
  }

  const handleChange = ev => {
    setInputValue(ev.target.value)
  }

  const handleStop = () => {
    // not supported right now
    return
  }

  const handleClick = () =>
    onAssistantExecute({ value: inputValue, conversationId }, () => {
      handleClear()
      inputRef.current.style.height = 'auto'
    })

  return (
    <div className="u-w-100 u-maw-7 u-mh-auto">
      <div
        className={`${styles['conversationBarSibling']} ${
          hasConversationStarted
            ? styles['conversationBarSibling--started']
            : ''
        } u-flex u-flex-column u-flex-items-center u-flex-justify-end`}
      >
        <Typography variant="h3" align="center" className="u-mb-2">
          {t('assistant.conversationBar.startMessage')}
        </Typography>
      </div>

      <SearchBar
        className={styles['conversationBar']}
        icon={null}
        size="auto"
        placeholder={t('assistant.search.placeholder')}
        value={inputValue}
        disabledClear
        componentsProps={{
          inputBase: {
            inputRef: inputRef,
            className: 'u-pv-0',
            rows: 1,
            multiline: true,
            inputProps: {
              className: styles['conversationBar-input']
            },
            autoFocus: !isMobile,
            startAdornment: (
              <Button
                classes={{ label: 'u-w-2 u-h-2' }}
                label={<Icon icon="plus" size={14} />}
                variant="text"
                color="inherit"
                style={{ marginRight: 2, marginLeft: -12 }}
              />
            ),
            endAdornment: (
              <div
                style={{
                  marginRight: -8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                  flex: 'none'
                }}
              >
                {assistantStatus !== 'idle' ? (
                  <Button
                    component="div"
                    className="u-miw-auto u-mih-auto u-w-2 u-h-2 u-bdrs-circle u-p-1 u-mr-1"
                    classes={{ label: 'u-flex u-w-auto' }}
                    label={<Icon icon={StopIcon} size={12} />}
                    onClick={handleStop}
                  />
                ) : (
                  <Button
                    component="div"
                    className="u-miw-auto u-mih-auto u-w-2 u-h-2 u-bdrs-circle u-p-1 u-mr-1"
                    classes={{ label: 'u-flex u-w-auto' }}
                    label={<Icon icon={PaperplaneIcon} size={14} />}
                    disabled={!inputValue}
                    onClick={handleClick}
                  />
                )}
              </div>
            ),
            onKeyDown: ev => {
              if (!isMobile) {
                if (ev.shiftKey && ev.key === 'Enter') {
                  return ev
                }

                if (ev.key === 'Enter') {
                  ev.preventDefault() // prevent form submit
                  return handleClick()
                }
              }
            }
          }
        }}
        onChange={handleChange}
      />

      <div
        className={`${styles['conversationBarSibling']} u-flex u-flex-column u-flex-items-center u-flex-justify-start`}
      >
        <ChatModes />
      </div>
    </div>
  )
}

export default ConversationBar
