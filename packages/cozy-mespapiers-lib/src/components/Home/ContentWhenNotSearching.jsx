import uniqBy from 'lodash/uniqBy'
import PropTypes from 'prop-types'
import React, { useMemo } from 'react'

import Empty from 'cozy-ui/transpiled/react/Empty'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import HomeCloud from '../../assets/icons/HomeCloud.svg'
import PaperGroup from '../Papers/PaperGroup'

const ContentWhenNotSearching = ({ papers, contacts, konnectors }) => {
  const { t } = useI18n()

  const allDocs = useMemo(() => papers.concat(contacts), [papers, contacts])
  const hasDocs = allDocs?.length > 0

  const papersByCategories = useMemo(
    () => uniqBy(papers, 'metadata.qualification.label'),
    [papers]
  )

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
