import PropTypes from 'prop-types'
import React, { useMemo } from 'react'

import Empty from 'cozy-ui/transpiled/react/Empty'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { makePapersGroupByQualificationLabel } from './helpers'
import HomeCloud from '../../assets/icons/HomeCloud.svg'
import PaperGroup from '../Papers/PaperGroup'

const ContentWhenNotSearching = ({ papers, contacts, konnectors }) => {
  const { t } = useI18n()

  const hasKonnectorWithoutFiles = konnectors.some(
    ({ konnectorQualifLabelsWithoutFile }) =>
      konnectorQualifLabelsWithoutFile.length > 0
  )

  const allDocs = useMemo(() => papers.concat(contacts), [papers, contacts])
  const hasDocs = allDocs?.length > 0

  if (!hasDocs && !hasKonnectorWithoutFiles) {
    return (
      <Empty
        className="u-ph-1"
        icon={HomeCloud}
        iconSize="large"
        title={t('Home.Empty.title')}
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
