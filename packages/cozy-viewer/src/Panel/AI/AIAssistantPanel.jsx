import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useCallback, useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { useClient } from 'cozy-client'
import { extractText, chatCompletion } from 'cozy-client/dist/models/ai'
import { fetchBlobFileById } from 'cozy-client/dist/models/file'
import logger from 'cozy-logger'
import Button from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import AssistantIcon from 'cozy-ui/transpiled/react/Icons/Assistant'
import CopyIcon from 'cozy-ui/transpiled/react/Icons/Copy'
import CrossMediumIcon from 'cozy-ui/transpiled/react/Icons/CrossMedium'
import RefreshIcon from 'cozy-ui/transpiled/react/Icons/Refresh'
import Paper from 'cozy-ui/transpiled/react/Paper'
import Stack from 'cozy-ui/transpiled/react/Stack'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { SUMMARY_SYSTEM_PROMPT, getSummaryUserPrompt } from './prompts'
import styles from './styles.styl'
import { getSummaryConfig, roughTokensEstimation } from '../../helpers'
import { useViewer } from '../../providers/ViewerProvider'

const AIAssistantPanel = () => {
  const { t } = useI18n()
  const client = useClient()
  const { file, setIsOpenAiAssistant } = useViewer()
  const { showAlert } = useAlert()

  const [isLoading, setIsLoading] = useState(true)
  const [summary, setSummary] = useState('')
  const [error, setError] = useState(null)

  const location = useLocation()
  const navigate = useNavigate()

  const handleClose = () => {
    setIsOpenAiAssistant(false)
    if (location?.state?.showAIAssistant) {
      navigate('..')
    }
  }

  const summarizeFile = async ({ client, file, stream = false, model }) => {
    try {
      const fileBlob = await fetchBlobFileById(client, file?._id)

      const textContent = await extractText(client, fileBlob, {
        name: file.name,
        mime: file.mime
      })

      const summaryConfig = getSummaryConfig()
      if (
        summaryConfig?.maxTokens &&
        roughTokensEstimation(textContent) > summaryConfig.maxTokens
      ) {
        throw new Error(
          `Text content exceeds maximum token limit (${summaryConfig.maxTokens} tokens)`
        )
      }

      const messages = [
        { role: 'system', content: SUMMARY_SYSTEM_PROMPT },
        {
          role: 'user',
          content: getSummaryUserPrompt(textContent)
        }
      ]

      const summaryResponse = await chatCompletion(client, messages, {
        stream,
        model
      })

      return summaryResponse
    } catch (error) {
      logger.error('Error in summarizeFile:', error)
      throw error
    }
  }

  const fetchSummary = useCallback(async () => {
    if (!file) return

    setIsLoading(true)
    setError(null)
    try {
      const response = await summarizeFile({ client, file, stream: false })
      if (response && response.content) {
        setSummary(response.content)
      } else if (response && response.choices && response.choices[0]) {
        setSummary(response.choices[0].message.content)
      }
    } catch (err) {
      setError(err.message || 'Failed to generate summary')
    } finally {
      setIsLoading(false)
    }
  }, [client, file])

  const handleRefresh = () => {
    fetchSummary()
  }

  const handleCopy = () => {
    if (summary) {
      navigator.clipboard.writeText(summary)
      showAlert({ message: t('Viewer.ai.copied'), severity: 'success' })
    }
  }

  useEffect(() => {
    fetchSummary()
  }, [fetchSummary])

  return (
    <>
      <Stack spacing="s" className={cx('u-flex u-flex-column u-h-100')}>
        <Paper
          className={cx({
            'u-flex-grow-1': !isLoading
          })}
          elevation={2}
          square
        >
          <div className="u-flex u-flex-items-center u-flex-justify-between u-h-3 u-ph-1 u-flex-shrink-0">
            <Typography variant="h4">
              <Icon icon={AssistantIcon} /> {t('Viewer.ai.panelTitle')}
            </Typography>
            <IconButton aria-label="Close AI Assistant" onClick={handleClose}>
              <Icon icon={CrossMediumIcon} />
            </IconButton>
          </div>
          {!isLoading && (
            <Stack spacing="s" className="u-ph-1">
              <div>
                <div className="u-flex u-flex-items-center u-flex-justify-between u-mb-1">
                  <Typography variant="subtitle1">
                    {t('Viewer.ai.bodyText')}
                  </Typography>
                  <div className="u-flex">
                    <IconButton size="small" onClick={handleRefresh}>
                      <Icon icon={RefreshIcon} />
                    </IconButton>
                    {summary && (
                      <IconButton size="small" onClick={handleCopy}>
                        <Icon icon={CopyIcon} />
                      </IconButton>
                    )}
                  </div>
                </div>
                <Typography className="u-mb-1">
                  {error ? (
                    <span style={{ color: 'var(--errorColor)' }}>{error}</span>
                  ) : (
                    summary
                  )}
                </Typography>
                {!isLoading && summary && (
                  <Typography variant="caption" color="textSecondary">
                    {t('Viewer.ai.footerText')}
                  </Typography>
                )}
              </div>
            </Stack>
          )}
        </Paper>
        {isLoading ? (
          <>
            <div className={styles.loaderContainer}>
              <div className={styles.loaderBar} />
            </div>
            <div className="u-flex u-flex-items-center u-flex-justify-between u-ph-1">
              <Typography
                variant="body1"
                className="u-flex u-flex-items-center"
              >
                <Icon
                  icon={AssistantIcon}
                  color="var(--primaryColor)"
                  className="u-mr-1"
                />
                {t('Viewer.ai.loadingText')}
              </Typography>
              <Button
                size="small"
                variant="text"
                color="default"
                label={t('Viewer.ai.stop')}
                onClick={handleClose}
              />
            </div>
          </>
        ) : null}
      </Stack>
    </>
  )
}

AIAssistantPanel.propTypes = {
  isLoading: PropTypes.bool,
  summary: PropTypes.string,
  onStop: PropTypes.func,
  onSend: PropTypes.func
}

AIAssistantPanel.defaultProps = {
  isLoading: false,
  summary: ''
}

export default AIAssistantPanel
