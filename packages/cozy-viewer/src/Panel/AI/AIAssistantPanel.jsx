import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useCallback, useState, useEffect, useRef } from 'react'

import { useClient } from 'cozy-client'
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
import Alerter from 'cozy-ui/transpiled/react/deprecated/Alerter'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { summarizeFile } from '../../helpers/aiApi'
import { useViewer } from '../../providers/ViewerProvider'

const loaderStyles = {
  container: {
    position: 'relative',
    overflow: 'hidden',
    height: '3px',
    width: '100%',
    backgroundColor: 'var(--dividerColor)',
    marginTop: '0px'
  },
  bar: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    background:
      'linear-gradient(90deg, #00B8D4 0%, #667EEA 25%, #F093FB 50%, #F5576C 75%, #FDB813 100%)',
    animation: 'aiLoaderSlide 2s linear infinite'
  }
}

const AIAssistantPanel = () => {
  const { t } = useI18n()
  const { file, setIsOpenAiAssistant } = useViewer()
  const client = useClient()

  const [isLoading, setIsLoading] = useState(true)
  const [summary, setSummary] = useState('')
  const [error, setError] = useState(null)

  const fetchedFileIdRef = useRef(null)
  const isFetchingRef = useRef(false)

  const handleClose = () => {
    setIsOpenAiAssistant(false)
  }

  const fetchSummary = useCallback(
    async (force = false) => {
      // Prevent duplicate fetches for the same file
      if (
        !force &&
        (fetchedFileIdRef.current === file._id || isFetchingRef.current)
      ) {
        return
      }

      isFetchingRef.current = true
      setIsLoading(true)
      setError(null)

      try {
        const response = await summarizeFile({ file, stream: false })
        const summaryContent =
          response?.content || response?.choices?.[0]?.message?.content
        setSummary(summaryContent)
        const fileMetadata = file.metadata || {}
        await client
          .collection('io.cozy.files')
          .updateMetadataAttribute(file._id, {
            ...fileMetadata,
            description: summaryContent
          })
        fetchedFileIdRef.current = file._id
      } catch (err) {
        setError(err.message || 'Failed to generate summary')
        Alerter.error(t('Viewer.ai.error.summary'))
      } finally {
        setIsLoading(false)
        isFetchingRef.current = false
      }
    },
    [client, file, t]
  )

  const handleRefresh = () => {
    fetchedFileIdRef.current = null
    fetchSummary(true)
  }

  const handleCopy = () => {
    if (summary) {
      navigator.clipboard.writeText(summary)
      Alerter.success(t('Viewer.ai.copied'))
    }
  }

  useEffect(() => {
    fetchSummary()
  }, [fetchSummary])

  return (
    <>
      <style>
        {`
          @keyframes aiLoaderSlide {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }
        `}
      </style>
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
              <Icon icon={AssistantIcon} /> Ai assistant
            </Typography>
            <IconButton aria-label="Close AI Assistant" onClick={handleClose}>
              <Icon icon={CrossMediumIcon} />
            </IconButton>
          </div>
          {!isLoading && (
            <Stack spacing="s" className="u-ph-1">
              <div>
                <div className="u-flex u-flex-items-center u-flex-justify-between u-mb-1">
                  <Typography variant="subtitle1">Summary</Typography>
                  <div className="u-flex">
                    <IconButton size="small" onClick={handleRefresh}>
                      <Icon icon={RefreshIcon} />
                    </IconButton>
                    <IconButton size="small" onClick={handleCopy}>
                      <Icon icon={CopyIcon} />
                    </IconButton>
                  </div>
                </div>
                <Typography className="u-mb-1">
                  {error ? (
                    <span style={{ color: 'var(--errorColor)' }}>{error}</span>
                  ) : (
                    summary
                  )}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  This content is generated by AI and may contain errors.
                </Typography>
              </div>
            </Stack>
          )}
        </Paper>
        {isLoading ? (
          <>
            <div style={loaderStyles.container}>
              <div style={loaderStyles.bar} />
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
                Summarizing content
              </Typography>
              <Button
                size="small"
                variant="text"
                color="default"
                label="Stop"
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
