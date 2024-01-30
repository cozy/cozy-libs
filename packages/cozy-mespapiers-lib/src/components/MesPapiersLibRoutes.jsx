import PropTypes from 'prop-types'
import React from 'react'
import {
  Routes,
  Route,
  useSearchParams,
  Navigate,
  useLocation,
  Outlet
} from 'react-router-dom'

import InstallAppFromIntent from './InstallAppFromIntent/InstallAppFromIntent'
import InstallKonnectorFromIntent from './InstallKonnectorFromIntent/InstallKonnectorFromIntent'
import MesPapiersLibProviders from './MesPapiersLibProviders'
import ForwardModalByRoute from './Multiselect/ForwardModalByRoute'
import ShareBottomSheetByRoute from './Multiselect/ShareBottomSheetByRoute'
import OnboardedGuardedRoute from './OnboardedGuardedRoute'
import ContactEdit from './Views/ContactEdit'
import CreatePaperModal from './Views/CreatePaperModal'
import ErrorBoundary from './Views/ErrorBoundary'
import FilesViewerWithQuery from './Views/FileViewerWithQuery'
import HarvestRoutes from './Views/HarvestRoutes'
import Home from './Views/Home'
import InformationEdit from './Views/InformationEdit'
import MultiselectView from './Views/MultiselectView'
import Onboarding from './Views/Onboarding'
import PageEdit from './Views/PageEdit'
import PapersList from './Views/PapersList'
import PlaceholdersSelector from './Views/PlaceholdersSelector'

const fileViewerRoutes = [
  <Route key="01" path="forward/:fileId" element={<ForwardModalByRoute />} />,
  <Route key="02" path="share" element={<ShareBottomSheetByRoute />} />,
  <Route key="03" path="edit/information" element={<InformationEdit />} />,
  <Route key="04" path="edit/page" element={<PageEdit />} />,
  <Route key="05" path="edit/contact" element={<ContactEdit />} />
]

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
        <Route
          element={<OnboardedGuardedRoute />}
          errorElement={<ErrorBoundary />}
        >
          <Route path="/" element={<OutletWrapper Component={Home} />}>
            <Route path="editcontact/:fileId" element={<ContactEdit />} />
            <Route path="installAppIntent" element={<InstallAppFromIntent />} />
            <Route
              path="installKonnectorIntent"
              element={<InstallKonnectorFromIntent />}
            />
            <Route path="create" element={<PlaceholdersSelector />} />
            <Route
              path="create/:qualificationLabel"
              element={<CreatePaperModal />}
            />
            <Route
              path="multiselect"
              element={<OutletWrapper Component={MultiselectView} />}
            >
              <Route path="forward/:fileId" element={<ForwardModalByRoute />} />
              <Route path="share" element={<ShareBottomSheetByRoute />} />
              <Route
                path="view/:fileId"
                element={<OutletWrapper Component={FilesViewerWithQuery} />}
              >
                {fileViewerRoutes.map(Component => Component)}
              </Route>
            </Route>
          </Route>
          <Route
            path="files/:qualificationLabel"
            element={<OutletWrapper Component={PapersList} />}
          >
            <Route path="forward/:fileId" element={<ForwardModalByRoute />} />
            <Route path="share" element={<ShareBottomSheetByRoute />} />
            <Route path="editcontact/:fileId" element={<ContactEdit />} />
            <Route path="installAppIntent" element={<InstallAppFromIntent />} />
            <Route
              path="installKonnectorIntent"
              element={<InstallKonnectorFromIntent />}
            />
            <Route path="create" element={<PlaceholdersSelector />} />
            <Route
              path="create/:qualificationLabel"
              element={<CreatePaperModal />}
            />
            <Route
              path=":fileId"
              element={<OutletWrapper Component={FilesViewerWithQuery} />}
            >
              {fileViewerRoutes.map(Component => Component)}
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
