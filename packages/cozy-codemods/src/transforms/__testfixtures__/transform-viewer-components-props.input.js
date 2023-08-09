import React from 'react'

import Viewer from 'cozy-ui/transpiled/react/Viewer'

const Comp = () => (
  <>
    <Viewer
      files={[]}
      currentIndex={0}
      onChangeRequest={() => {}}
      onCloseRequest={() => {}}
      componentsProps={{
        OnlyOfficeViewer: {
          isEnabled: true,
          opener: () => {}
        }
      }}
      toolbarProps={{ showToolbar: true }}
    />
    <Viewer
      files={[]}
      currentIndex={0}
      onChangeRequest={() => {}}
      onCloseRequest={() => {}}
      toolbarProps={{ showToolbar: false }}
    />
    <Viewer
      files={[]}
      currentIndex={0}
      onChangeRequest={() => {}}
      onCloseRequest={() => {}}
      onlyOfficeProps={{
        isEnabled: true,
        opener: () => {}
      }}
      toolbarProps={{ showToolbar: false }}
    />
  </>
)

export { Comp }
