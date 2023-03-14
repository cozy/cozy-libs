import React from 'react'
import {
  Routes,
  Route,
  useSearchParams,
  Navigate,
  useLocation,
  Outlet
} from 'react-router-dom'
import PropTypes from 'prop-types'

import { MesPapiersLibProviders } from './MesPapiersLibProviders'
import OnboardedGuardedRoute from './OnboardedGuardedRoute'
import Home from './Views/Home'
import MultiselectView from './Views/MultiselectView'
import PapersList from './Views/PapersList'
import FilesViewerWithQuery from './Views/FileViewerWithQuery'
import PlaceholderListModal from './Views/PlaceholderListModal'
import CreatePaperModal from './Views/CreatePaperModal'
import Onboarding from './Views/Onboarding'
import InformationEdit from './Views/InformationEdit'
import PageEdit from './Views/PageEdit'
import ContactEdit from './Views/ContactEdit'
import HarvestRoutes from './Views/HarvestRoutes'

const OutletWrapper = ({ Component }) => (
  <>
    <Component />
    <Outlet />
  </>
)

const MesPapiersLibRoutes = ({ lang, components }) => {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const konnectorSlug = searchParams.get('connectorSlug')

  // usefull when getting connectorSlug from Store after rerouting process
  // because of redirectAfterInstall
  if (konnectorSlug) {
    return <Navigate replace to={`${location.pathname}${konnectorSlug}`} />
  }

  return (
    <Routes>
      <Route
        element={<MesPapiersLibProviders lang={lang} components={components} />}
      >
        <Route element={<OnboardedGuardedRoute />}>
          <Route path="/" element={<OutletWrapper Component={Home} />}>
            <Route path="create" element={<PlaceholderListModal />} />
            <Route
              path="create/:qualificationLabel"
              element={<CreatePaperModal />}
            />
            <Route path="multiselect" element={<MultiselectView />} />
          </Route>
          <Route
            path="files/:fileTheme"
            element={<OutletWrapper Component={PapersList} />}
          >
            <Route path="create" element={<PlaceholderListModal />} />
            <Route
              path="create/:qualificationLabel"
              element={<CreatePaperModal />}
            />
            <Route
              path=":fileId"
              element={<OutletWrapper Component={FilesViewerWithQuery} />}
            >
              <Route path="edit/information" element={<InformationEdit />} />
              <Route path="edit/page" element={<PageEdit />} />
              <Route path="edit/contact" element={<ContactEdit />} />
            </Route>
            <Route
              path="harvest/:connectorSlug/*"
              element={<HarvestRoutes />}
            />
          </Route>
          <Route path="onboarding" element={<Onboarding />} />
        </Route>
      </Route>
    </Routes>
  )
}

MesPapiersLibRoutes.propTypes = {
  lang: PropTypes.string,
  components: PropTypes.objectOf(PropTypes.func)
}

export default MesPapiersLibRoutes
