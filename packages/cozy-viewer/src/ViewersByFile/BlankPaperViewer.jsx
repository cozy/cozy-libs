import React, { useState } from 'react'

import Backdrop from 'cozy-ui/transpiled/react/Backdrop'
import Button from 'cozy-ui/transpiled/react/Buttons'
import Empty from 'cozy-ui/transpiled/react/Empty'
import IntentDialogOpener from 'cozy-ui/transpiled/react/IntentDialogOpener'

import styles from './styles.styl'
import IlluGenericNewPage from '../assets/IlluGenericNewPage.svg'
import { withViewerLocales } from '../hoc/withViewerLocales'

const BlankPaperViewer = ({ file, t }) => {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className={styles['viewer-noviewer']}>
      <Empty
        icon={<img src={IlluGenericNewPage} />}
        text={t('Viewer.noImage')}
        componentsProps={{
          text: { color: 'inherit' }
        }}
      >
        <IntentDialogOpener
          action="OPEN"
          doctype="io.cozy.files.paper"
          Component={Backdrop}
          invisible={!isLoading}
          isOver
          options={{
            fileId: file._id,
            qualificationLabel: file.metadata?.qualification?.label
          }}
          showCloseButton={false}
          iframeProps={{
            spinnerProps: { className: 'u-m-0', middle: true, color: 'white' },
            setIsLoading
          }}
        >
          <Button className="u-mt-1" label={t('Viewer.complete')} />
        </IntentDialogOpener>
      </Empty>
    </div>
  )
}

export default withViewerLocales(BlankPaperViewer)
