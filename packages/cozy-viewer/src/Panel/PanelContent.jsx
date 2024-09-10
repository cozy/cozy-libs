import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'

import Paper from 'cozy-ui/transpiled/react/Paper'
import Stack from 'cozy-ui/transpiled/react/Stack'
import Typography from 'cozy-ui/transpiled/react/Typography'

import getPanelBlocks, { getPanelBlocksSpecs } from './getPanelBlocks'
import { withViewerLocales } from '../hoc/withViewerLocales'

const PanelContent = ({ file, isPublic, t }) => {
  const panelBlocks = getPanelBlocks({
    panelBlocksSpecs: getPanelBlocksSpecs(isPublic),
    file
  })

  return (
    <Stack spacing="s" className={cx('u-flex u-flex-column u-h-100')}>
      <Paper
        className="u-flex u-flex-items-center u-h-3 u-ph-2 u-flex-shrink-0"
        elevation={2}
        square
      >
        <Typography variant="h4">{t('Viewer.panel.title')}</Typography>
      </Paper>
      {panelBlocks.map((PanelBlock, index) => (
        <Paper
          key={index}
          className={cx({
            'u-flex-grow-1': index === panelBlocks.length - 1
          })}
          elevation={2}
          square
        >
          <Typography variant="h4" className="u-pv-1">
            <PanelBlock file={file} />
          </Typography>
        </Paper>
      ))}
    </Stack>
  )
}

PanelContent.propTypes = {
  file: PropTypes.object.isRequired,
  isPublic: PropTypes.bool
}

export default withViewerLocales(PanelContent)
