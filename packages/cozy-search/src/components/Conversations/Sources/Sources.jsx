import React, { useState, useRef, useEffect } from 'react'

import { useQuery, isQueryLoading } from 'cozy-client'
import Box from 'cozy-ui/transpiled/react/Box'
import Chip from 'cozy-ui/transpiled/react/Chips'
import Grow from 'cozy-ui/transpiled/react/Grow'
import Icon from 'cozy-ui/transpiled/react/Icon'
import MultiFilesIcon from 'cozy-ui/transpiled/react/Icons/MultiFiles'
import RightIcon from 'cozy-ui/transpiled/react/Icons/Right'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import SourcesItem from './SourcesItem'
import { buildFilesByIds } from '../../queries'
import { filter } from 'lodash'

const Sources = ({ messageId, files }) => {
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

  const filterSources = files.filter(file => !file.name.includes('.pptx'))
  return (
    <Box ref={ref} className="u-mt-1-half" pl="44px">
      <Chip
        className="u-mb-1"
        icon={<Icon icon={MultiFilesIcon} className="u-ml-half" />}
        label={t('assistant.sources', filterSources.length)}
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
          {filterSources.map(file => (
            <SourcesItem key={`${messageId}-${file._id}`} file={file} />
          ))}
        </div>
      </Grow>
    </Box>
  )
}

const SourcesWithFilesQuery = ({ messageId, sources }) => {
  const fileIds = sources.map(source => source.id)

  const filesByIds = buildFilesByIds(fileIds)
  const { data: files, ...queryResult } = useQuery(
    filesByIds.definition,
    filesByIds.options
  )

  const isLoading = isQueryLoading(queryResult)

  if (isLoading || files.length === 0) return null

  return <Sources messageId={messageId} files={files} />
}

export default SourcesWithFilesQuery
