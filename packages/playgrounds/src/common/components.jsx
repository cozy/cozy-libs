/** Components meant to be used in several examples */

import React from 'react'
import { withClient, queryConnect } from 'cozy-client'
import Spinner from 'cozy-ui/transpiled/react/Spinner'

export const LogoutButton = withClient(({ client }) => {
  return <button onClick={() => client.logout()}>Logout</button>
})

class _AppList extends React.Component {
  render() {
    if (this.props.apps.fetchStatus === 'loading') {
      return <Spinner />
    }
    return (
      <div>
        {this.props.apps.data.map(app => (
          <div key={app.slug}>
            {app.slug}: {app.name}
          </div>
        ))}
      </div>
    )
  }
}

export const AppList = queryConnect({
  apps: {
    query: client => client.all('io.cozy.apps'),
    as: 'apps'
  }
})(_AppList)
