import PropTypes from 'prop-types'
import React, { useMemo } from 'react'

import Empty from 'cozy-ui/transpiled/react/Empty'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import { makePapersGroupByQualificationLabel } from './helpers'
import HomeCloud from '../../assets/icons/HomeCloud.svg'
import PaperGroup from '../Papers/PaperGroup'

const ContentWhenNotSearching = ({ papers, contacts, konnectors }) => {
  const { t } = useI18n()

  const allDocs = useMemo(() => papers.concat(contacts), [papers, contacts])
  const hasDocs = allDocs?.length > 0

  if (!hasDocs) {
    return (
      <Empty
        className="u-ph-1"
        icon={HomeCloud}
        iconSize="large"
        title={t('Home.Empty.title')}
        text={t('Home.Empty.text')}
      />
    )
  }

  const papersByCategories = makePapersGroupByQualificationLabel(papers)

  return (
    <PaperGroup
      papersByCategories={papersByCategories}
      konnectors={konnectors}
    />
  )
}

ContentWhenNotSearching.propTypes = {
  contacts: PropTypes.array,
  papers: PropTypes.array,
  konnectors: PropTypes.array
}

export default ContentWhenNotSearching
