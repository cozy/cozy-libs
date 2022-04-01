import React from 'react'
import { Switch, Redirect, HashRouter } from 'react-router-dom'

import Home from './Home/Home'
import Onboarding from './Onboarding/Onboarding'
import PapersListWrapper from './Papers/PapersListWrapper'
import FilesViewerWithQuery from './Viewer/FileViewerWithQuery'
import OnboardedGuardedRoute from './OnboardedGuardedRoute'
import PlaceholderThemesListModal from './Placeholders/PlaceholderThemesListModal'
import CreatePaperModal from './StepperDialog/CreatePaperModal'

const routes = [
  {
    path: '/paper',
    component: Home
  },
  {
    path: '/paper/files/:fileCategory',
    component: PapersListWrapper
  },
  {
    path: '/paper/file/:fileId',
    component: FilesViewerWithQuery
  },
  {
    path: '/paper/onboarding',
    component: Onboarding
  },
  {
    path: '/paper/create',
    component: PlaceholderThemesListModal
  },
  {
    path: '/paper/create/:qualificationLabel',
    render: props => {
      const {
        location: { search },
        history
      } = props
      const isDeepBack = search.includes('deepBack')
      const onClose = () => history.go(isDeepBack ? -2 : -1)

      return <CreatePaperModal {...props} onClose={onClose} />
    }
  }
]

export const AppRouter = () => {
  return (
    <HashRouter>
      <Switch>
        {routes.map((route, idx) => (
          <OnboardedGuardedRoute
            key={idx}
            exact
            path={route.path}
            component={route.component}
            render={route.render}
          />
        ))}
        <Redirect from="*" to="/paper" />
      </Switch>
    </HashRouter>
  )
}
