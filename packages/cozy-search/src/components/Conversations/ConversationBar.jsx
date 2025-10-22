import React, { useState, useRef } from 'react'
import { useParams } from 'react-router-dom'

import Button from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'
import PaperplaneIcon from 'cozy-ui/transpiled/react/Icons/Paperplane'
import StopIcon from 'cozy-ui/transpiled/react/Icons/Stop'
import SearchBar from 'cozy-ui/transpiled/react/SearchBar'
import Chip from 'cozy-ui/transpiled/react/Chips'
import useEventListener from 'cozy-ui/transpiled/react/hooks/useEventListener'
import { useBreakpoints } from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import styles from './styles.styl'
import { useAssistant } from '../AssistantProvider'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { TwakeAssistantIcon } from '../AssistantIcon/TwakeAssistantIcon'
import { TwakeAssistantIconColor } from '../AssistantIcon/TwakeAssistantIconColor'

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

  const [webSearchEnabled, setWebSearchEnabled] = useState(false)

  return (
    <div className="u-w-100 u-maw-7 u-mh-auto">
      <div className={`${styles['conversationBarSibling']} ${hasConversationStarted ? styles['conversationBarSibling--started'] : ''} u-flex u-flex-column u-flex-items-center u-flex-justify-end`}>
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
                label={<Icon icon={"plus"} size={14} />}
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
                  flex: "none"
                }}
              >
                {!hasConversationStarted && (
                  <Button
                    startIcon={<Icon icon={"globe"} size={14} />}
                    label={t('assistant.modes.web_search')}
                    onClick={() => { setWebSearchEnabled(!webSearchEnabled) }}
                    variant="text"
                    color={webSearchEnabled ? "primary" : "inherit"}
                    size="small"
                  />
                )}

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

      <div className={`${styles['conversationBarSibling']} ${hasConversationStarted ? styles['conversationBarSibling--started'] : ''} u-flex u-flex-column u-flex-items-center u-flex-justify-start`}>
        <ChatModes />
      </div>
    </div>
  )
}

const ChatModes = () => {
  const { t } = useI18n()

  const modes = [
    { key: "twake_knowledge", label: t("assistant.modes.twake_knowledge"), icon: TwakeAssistantIconColor },
    { key: "legal", label: t("assistant.modes.legal"), icon: 'justice' },
    { key: 'financial', label: t("assistant.modes.financial"), icon: 'benefit' },
    { key: 'image_creation', label: t("assistant.modes.image_creation"), icon: 'image' },
    { key: 'code_assistant', label: t("assistant.modes.code_assistant"), icon: 'lightning' },
    { key: 'brainstorming', label: t("assistant.modes.brainstorming"), icon: 'lightbulb' },
    { key: 'travel_planner', label: t("assistant.modes.travel_planner"), icon: 'plane' },
    { key: 'fitness_coach', label: t("assistant.modes.fitness_coach"), icon: 'fitness' },
    { key: 'recipe_suggester', label: t("assistant.modes.recipe_suggester"), icon: 'restaurant' }
  ]

  const [enabledModes, setEnabledModes] = useState(["twake_knowledge"])

  return (
    <div
      className="u-flex u-flex-row u-flex-wrap u-w-100 u-flex-justify-start"
      style={{ gap: 8 }}
    >
      {modes.splice(0,4).map(mode => (
        <Chip
          icon={<Icon icon={mode.icon} style={{ marginLeft: 12 }} />}
          label={mode.label}
          clickable
          key={mode.label}
          variant={enabledModes.includes(mode.key) ? 'ghost' : 'default'}
          className="u-mr-0"
          onClick={() => {
            if (enabledModes.includes(mode.key)) {
              setEnabledModes(enabledModes.filter(m => m !== mode.key))
            } else {
              setEnabledModes([...enabledModes, mode.key])
            }
          }}
        />
      ))}

      {modes.length > 0 && (
        <Chip
          label={`+${modes.length} more`}
          clickable
          variant="default"
          className="u-mr-0"
          onClick={() => {
            // Handle click for additional modes
          }}
        />
      )}
    </div>
  )
}

export default ConversationBar
