import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'

import { useClient } from 'cozy-client'
import List from 'cozy-ui/transpiled/react/MuiCozyTheme/List'
import ListSubheader from 'cozy-ui/transpiled/react/MuiCozyTheme/ListSubheader'
import ListItem from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Icon from 'cozy-ui/transpiled/react/Icon'
import Divider from 'cozy-ui/transpiled/react/MuiCozyTheme/Divider'
import MuiCardMedia from 'cozy-ui/transpiled/react/CardMedia'
import { FileImageLoader } from 'cozy-ui/transpiled/react/FileImageLoader'
import Typography from 'cozy-ui/transpiled/react/Typography'

import { useScannerI18n } from '../Hooks/useScannerI18n'
import { useMultiSelection } from '../Hooks/useMultiSelection'

const PaperGroup = ({ papersByCategories }) => {
  const navigate = useNavigate()
  const client = useClient()
  const { t } = useI18n()
  const scannerT = useScannerI18n()
  const { isMultiSelectionActive, setSelectedThemeLabel } = useMultiSelection()

  const goPapersList = category => {
    if (isMultiSelectionActive) {
      setSelectedThemeLabel(category)
    } else {
      navigate(`files/${category}`)
    }
  }

  return (
    <List className="u-pv-0">
      <ListSubheader>{t('PapersList.subheader')}</ListSubheader>
      <div className="u-pv-half">
        {papersByCategories.length === 0 ? (
          <Typography
            className="u-ml-1 u-mv-1"
            variant="body2"
            color="textSecondary"
          >
            {t('PapersList.empty')}
          </Typography>
        ) : (
          papersByCategories.map((paper, index) => {
            const category = paper?.metadata?.qualification?.label

            return (
              <Fragment key={paper.id}>
                <ListItem button onClick={() => goPapersList(category)}>
                  <ListItemIcon>
                    <FileImageLoader
                      client={client}
                      file={paper}
                      linkType="tiny"
                      render={src => (
                        <MuiCardMedia
                          component="img"
                          width={32}
                          height={32}
                          image={src}
                        />
                      )}
                      renderFallback={() => (
                        <Icon icon="file-type-image" size={32} />
                      )}
                    />
                  </ListItemIcon>
                  <ListItemText primary={scannerT(`items.${category}`)} />
                  <Icon
                    icon="right"
                    size={16}
                    color="var(--secondaryTextColor)"
                  />
                </ListItem>
                {index !== papersByCategories.length - 1 && (
                  <Divider variant="inset" component="li" />
                )}
              </Fragment>
            )
          })
        )}
      </div>
    </List>
  )
}

PaperGroup.propTypes = {
  papersByCategories: PropTypes.arrayOf(PropTypes.object)
}

export default PaperGroup
