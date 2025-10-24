import React, { useState, useRef, useMemo, useEffect } from 'react'
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
import { ExpertIcon } from '../AssistantIcon/ExpertIcon'
import { KnowledgeBaseIcon } from '../AssistantIcon/KnowledgeBaseIcon'
import Alert from 'cozy-ui/transpiled/react/Alert'
import AlertTitle from 'cozy-ui/transpiled/react/AlertTitle'


const ChatModes = () => {
  const { t } = useI18n()

  const experts = [
    { key: "legal", label: t("assistant.experts.legal"), icon: 'justice', external: true },
    { key: 'financial', label: t("assistant.experts.financial"), icon: 'benefit' },
    { key: 'image_creation', label: t("assistant.experts.image_creation"), icon: 'image', external: true },
    { key: 'marketing', label: t("assistant.experts.marketing"), icon: 'lightning' },
    { key: 'code_assistant', label: t("assistant.experts.code_assistant"), icon: 'lightning' },
    { key: 'brainstorming', label: t("assistant.experts.brainstorming"), icon: 'lightbulb' },
    { key: 'travel_planner', label: t("assistant.experts.travel_planner"), icon: 'plane' },
    { key: 'fitness_coach', label: t("assistant.experts.fitness_coach"), icon: 'fitness' },
    { key: 'recipe_suggester', label: t("assistant.experts.recipe_suggester"), icon: 'restaurant' }
  ]

  const knowledges = [
    { key: "twake_knowledge", label: t('assistant.knowledge_bases.twake_knowledge'), icon: TwakeAssistantIconColor },
    { key: "web", label: t('assistant.knowledge_bases.web'), icon: 'globe' },
    { key: "linagora_client", label: t('assistant.knowledge_bases.linagora_client'), icon: 'collect' },
    { key: "security_procedures", label: t('assistant.knowledge_bases.security_procedures'), icon: 'lock' },
    { key: "other_1", label: t('assistant.knowledge_bases.other'), icon: 'globe' },
    { key: "other_2", label: t('assistant.knowledge_bases.other'), icon: 'globe' },
    { key: "other_3", label: t('assistant.knowledge_bases.other'), icon: 'globe' },
    { key: "other_4", label: t('assistant.knowledge_bases.other'), icon: 'globe' },
    { key: "other_5", label: t('assistant.knowledge_bases.other'), icon: 'globe' },
    { key: "other_6", label: t('assistant.knowledge_bases.other'), icon: 'globe' }
  ]

  const [selectedExpert, setSelectedExpert] = useState(null)
  const [selectedKnowledges, setSelectedKnowledges] = useState(
    knowledges.map(knowledge => knowledge.key)
  )
  const prevExpertRef = useRef(null)

  const isExternalExpertSelected = useMemo(() => {
    const expert = selectedExpert ? experts.find(e => e.key === selectedExpert) : null
    return expert ? expert.external : false
  }, [selectedExpert, experts])

  useEffect(() => {
    const prevExpert = prevExpertRef.current
    const currentExpert = selectedExpert ? experts.find(e => e.key === selectedExpert) : null

    if (!selectedExpert && prevExpert !== null) {
      setSelectedKnowledges(knowledges.map(knowledge => knowledge.key))
    }

    prevExpertRef.current = selectedExpert
  }, [selectedExpert, experts, knowledges]);

  return (
    <div
      className="u-flex u-flex-column u-flex-items-start u-flex-justify-start, u-w-100"
    >
      <ChatKnowledges knowledges={knowledges} selectedKnowledges={selectedKnowledges} setSelectedKnowledges={setSelectedKnowledges} />
      <ChatExperts experts={experts} selectedExpert={selectedExpert} setSelectedExpert={setSelectedExpert} />

      {isExternalExpertSelected && (
        <ExternalExpertWarning />
      )}
    </div>
  )
}

const ChatExperts = ({ experts, selectedExpert, setSelectedExpert }) => {
  const { t } = useI18n()

  const expertsState = useMemo(() =>
    experts.map(expert => ({
      ...expert,
      selected: expert.key === selectedExpert
    })), [selectedExpert, experts])

  return (
    <ChatChips
      modes={expertsState}
      onModeSelect={key => {
        setSelectedExpert(key === selectedExpert ? null : key)
      }}
      splice={4}
      startIcon={ExpertIcon}
      moreEndLabel={t('assistant.conversationBar.more.experts')}
    />
  )
}

const ChatKnowledges = ({ knowledges, selectedKnowledges, setSelectedKnowledges }) => {
  const { t } = useI18n()

  const knowledgesState = useMemo(() =>
    knowledges.map(knowledge => ({
      ...knowledge,
      selected: selectedKnowledges.includes(knowledge.key)
    })), [selectedKnowledges])

  return (
    <ChatChips
      modes={knowledgesState}
      onModeSelect={key => {
        if (selectedKnowledges.includes(key)) {
          setSelectedKnowledges(selectedKnowledges.filter(k => k !== key))
        } else {
          setSelectedKnowledges([...selectedKnowledges, key])
        }
      }}
      splice={4}
      startIcon={KnowledgeBaseIcon}
      moreEndLabel={t('assistant.conversationBar.more.knowledge_bases')}
    />
  )
}


const ChatChips = ({ modes, onModeSelect, splice = 3, startIcon = ExpertIcon, moreEndLabel }) => {
  const visibleModes = modes.slice(0, splice)
  const remainingCount = modes.length - splice

  return (
    <div
      className="u-flex u-flex-row u-flex-wrap u-w-100 u-flex-justify-between u-flex-items-center u-mb-1"
      style={{ gap: 8 }}
    >
      <Icon icon={startIcon} size={24} style={{ opacity: 0.6 }} />

      {visibleModes.map(mode => {
        const warningColor = mode.selected ? 'var(--warningColor)' : undefined;
        return (
        <Chip
          icon={<Icon icon={mode.icon} style={{ marginLeft: 12 }} />}
          label={mode.label}
          clickable
          onDelete={mode.external && (() => { })}
          deleteIcon={mode.external && <Icon icon={"openwith"} className="u-h-1" style={{ fill: warningColor, color: warningColor }} />}
          color={(mode.external && mode.selected) ? 'warning' : undefined}
          key={mode.label}
          variant={mode.selected ? 'ghost' : 'default'}
          style={{
            borderStyle: 'solid'
          }}
          className="u-mr-0"
          onClick={() => {
            onModeSelect(mode.key)
          }}
        />
      )})}

      {remainingCount > 0 && (
        <Chip
          label={`+${remainingCount} ${moreEndLabel || 'more'}`}
          clickable
          variant="outlined"
        />
      )}
    </div>
  )
}

const ExternalExpertWarning = () => {
  const { t } = useI18n()

  return (
    <Alert
      severity="warning"
      style={{ width: 'calc(100% - (16px * 2))' }}
      action={
        <Button
          variant="text"
          label={t('assistant.experts.external_warning.know_more')}
          color="warning"
        />
      }
    >
      <AlertTitle>
        {t('assistant.experts.external_warning.title')}
      </AlertTitle>
      {t('assistant.experts.external_warning.description')}
    </Alert>
  )
}

export default ChatModes
