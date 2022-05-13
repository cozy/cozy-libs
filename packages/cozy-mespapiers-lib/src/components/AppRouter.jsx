import React from 'react'
import {
  Switch,
  Route,
  Redirect,
  HashRouter,
  useLocation
} from 'react-router-dom'

import Home from './Home/Home'
import Onboarding from './Onboarding/Onboarding'
import MultiselectView from './Multiselect/MultiselectView'
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
    path: '/paper/files/:fileTheme',
    component: PapersListWrapper
  },
  {
    path: '/paper/file/:fileId',
    component: FilesViewerWithQuery
  },
  {
    path: '/paper/onboarding',
    component: Onboarding
  }
]

const Routes = () => {
  const location = useLocation()
  const backgroundPath = new URLSearchParams(location.search).get(
    'backgroundPath'
  )
  const background = backgroundPath ? { pathname: backgroundPath } : null

  return (
    <>
      <Switch location={background || location}>
        {routes.map((route, idx) => (
          <OnboardedGuardedRoute
            key={idx}
            exact
            path={route.path}
            component={route.component}
          />
        ))}
        <Redirect from="*" to="/paper" />
      </Switch>
      {background && (
        <>
          <Route
            exact
            path={'/paper/multiselect'}
            component={MultiselectView}
          />
          <Route
            exact
            path={'/paper/create'}
            component={PlaceholderThemesListModal}
          />
          <Route
            exact
            path={'/paper/create/:qualificationLabel'}
            render={props => {
              const {
                location: { search },
                history
              } = props
              const isDeepBack = search.includes('deepBack')
              const onClose = () => history.go(isDeepBack ? -2 : -1)

              return <CreatePaperModal {...props} onClose={onClose} />
            }}
          />
        </>
      )}
    </>
  )
}

export const AppRouter = () => {
  return (
    <HashRouter>
      <Routes />
    </HashRouter>
  )
}
