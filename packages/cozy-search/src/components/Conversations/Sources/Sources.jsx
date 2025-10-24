import React, { useState, useRef, useEffect } from 'react'

import { useQuery, isQueryLoading } from 'cozy-client'
import Box from 'cozy-ui/transpiled/react/Box'
import Chip from 'cozy-ui/transpiled/react/Chips'
import Grow from 'cozy-ui/transpiled/react/Grow'
import Icon from 'cozy-ui/transpiled/react/Icon'
import MultiFilesIcon from 'cozy-ui/transpiled/react/Icons/MultiFiles'
import RightIcon from 'cozy-ui/transpiled/react/Icons/Right'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import EmailSourceItem from './EmailSourceItem'
import FileSourcesItem from './FileSourcesItem'
import { buildFilesByIds } from '../../queries'

const Sources = ({ messageId, files, emailSources }) => {
  const [showSources, setShowSources] = useState(false)
  const { t } = useI18n()
  const ref = useRef()

  const handleShowSources = () => {
    setShowSources(v => !v)
  }

  // we want to scroll down to the sources button when it is displayed
  useEffect(() => {
    ref.current?.scrollIntoView(false)
  }, [])

  useEffect(() => {
    if (showSources) {
      const sourcesBottom = ref.current.getBoundingClientRect().bottom
      const innerContainer =
        document.getElementsByClassName('cozyDialogContent')[0]
      const innerContainerBottom = innerContainer.getBoundingClientRect().bottom
      if (sourcesBottom > innerContainerBottom) {
        ref.current.scrollIntoView(false)
      }
    }
  }, [showSources])

  return (
    <Box ref={ref} className="u-mt-1-half" pl="44px">
      <Chip
        className="u-mb-1"
        icon={<Icon icon={MultiFilesIcon} className="u-ml-half" />}
        label={t('assistant.sources', files.length + emailSources.length)}
        deleteIcon={
          <Icon
            className="u-h-1"
            icon={RightIcon}
            rotate={showSources ? 90 : 0}
          />
        }
        clickable
        onClick={handleShowSources}
        onDelete={handleShowSources}
      />
      <Grow
        in={showSources}
        style={{ transformOrigin: '0 0 0' }}
        mountOnEnter={true}
        unmountOnExit={true}
      >
        <div>
          {files.map(file => (
            <FileSourcesItem key={`${messageId}-${file._id}`} file={file} />
          ))}
          {emailSources.map(email => (
            <EmailSourceItem key={`${messageId}-${email.id}`} email={email} />
          ))}
        </div>
      </Grow>
    </Box>
  )
}

const SourcesWithFilesQuery = ({ messageId, sources }) => {
  const fileIds = []
  const emailSources = []
  sources.map(source => {
    source.doctype === 'com.linagora.email'
      ? emailSources.push(source)
      : fileIds.push(source.id)
  })
  const filesByIds = buildFilesByIds(fileIds)
  const { data: files, ...queryResult } = useQuery(
    filesByIds.definition,
    filesByIds.options
  )

  const isLoading = isQueryLoading(queryResult)

  if (isLoading || files.length === 0) return null

  return (
    <Sources messageId={messageId} files={files} emailSources={emailSources} />
  )
}

export default SourcesWithFilesQuery
