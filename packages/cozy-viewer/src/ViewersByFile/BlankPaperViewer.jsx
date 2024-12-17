import React from 'react'

import Button from 'cozy-ui/transpiled/react/Buttons'
import Empty from 'cozy-ui/transpiled/react/Empty'

import styles from './styles.styl'
import IlluGenericNewPage from '../assets/IlluGenericNewPage.svg'
import IntentOpener from '../components/IntentOpener'
import { withViewerLocales } from '../hoc/withViewerLocales'

const BlankPaperViewer = ({ file, t }) => {
  return (
    <div className={styles['viewer-noviewer']}>
      <Empty
        icon={<img src={IlluGenericNewPage} />}
        text={t('Viewer.noImage')}
        componentsProps={{
          text: { color: 'inherit' }
        }}
      >
        <IntentOpener
          action="OPEN"
          doctype="io.cozy.files.paper"
          options={{
            path: `${file.metadata?.qualification?.label}/${file._id}`
          }}
        >
          <Button className="u-mt-1" label={t('Viewer.complete')} />
        </IntentOpener>
      </Empty>
    </div>
  )
}

export default withViewerLocales(BlankPaperViewer)
