/* global __VERSIONS__ */

import React from 'react'

import Typography from 'cozy-ui/transpiled/react/Typography'

import PanelContent from './PanelContent'

const Versions = () => {
  // @ts-ignore
  const versions = typeof __VERSIONS__ !== 'undefined' ? __VERSIONS__ : {}
  const entries = Object.entries(versions)
  return (
    <PanelContent>
      <Typography variant="subtitle1" gutterBottom>
        Library versions
      </Typography>
      {entries.map(([pkg, version]) => (
        <div key={pkg}>
          {pkg}: {version} -{' '}
          <img src={`https://img.shields.io/npm/v/${pkg}?style=flat-square}`} />
        </div>
      ))}
      {entries.length === 0 ? (
        <>
          <Typography variant="body1">
            __VERSIONS__ is not exposed to the app. For this panel to work, you
            must add the VersionsPlugin.
          </Typography>
          <pre>{`
const VersionPlugin = require('cozy-scripts/plugins/VersionPlugin')

new VersionPlugin({
    packages: ['cozy-bar', 'cozy-ui', 'cozy-harvest-lib']
})
          `}</pre>
        </>
      ) : null}
    </PanelContent>
  )
}

export default Versions
