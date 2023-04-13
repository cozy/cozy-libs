import PropTypes from 'prop-types'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import flag from 'cozy-flags'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import List from 'cozy-ui/transpiled/react/MuiCozyTheme/List'
import ListSubheader from 'cozy-ui/transpiled/react/MuiCozyTheme/ListSubheader'
import Typography from 'cozy-ui/transpiled/react/Typography'

import CategoryItemByPaper from './CategoryItemByPaper'
import KonnectorsCategories from './KonnectorsCategories'
import { useMultiSelection } from '../Hooks/useMultiSelection'

const PaperGroup = ({ papersByCategories, konnectors, selectedTheme }) => {
  const navigate = useNavigate()
  const { t } = useI18n()
  const { isMultiSelectionActive, setSelectedThemeLabel } = useMultiSelection()

  const hasPapers = Object.keys(papersByCategories).length > 0

  const goPapersList = category => {
    if (isMultiSelectionActive) {
      setSelectedThemeLabel(category)
    } else {
      navigate(`files/${category}`)
    }
  }

  return (
    <List
      {...(!flag('mespapiers.v2-1-0.enabled') && {
        subheader: <ListSubheader>{t('PapersList.subheader')}</ListSubheader>
      })}
    >
      {!hasPapers && (
        <Typography
          className="u-ml-1 u-mv-1"
          variant="body2"
          color="textSecondary"
        >
          {t('PapersList.empty')}
        </Typography>
      )}
      {hasPapers &&
        Object.entries(papersByCategories).map(([category, papers], index) => (
          <CategoryItemByPaper
            key={category}
            category={category}
            papers={papers}
            isLast={index === papersByCategories.length - 1}
            onClick={goPapersList}
          />
        ))}
      <KonnectorsCategories
        konnectors={konnectors}
        selectedTheme={selectedTheme}
        onClick={goPapersList}
      />
    </List>
  )
}

PaperGroup.propTypes = {
  papersByCategories: PropTypes.object,
  konnectors: PropTypes.arrayOf(PropTypes.object),
  selectedTheme: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
}

export default PaperGroup
