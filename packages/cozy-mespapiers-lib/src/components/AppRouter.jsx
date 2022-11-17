import React from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'

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

import OnboardedGuardedRoute from './OnboardedGuardedRoute'

export const AppRouter = () => {
  const location = useLocation()
  const backgroundPath = new URLSearchParams(location.search).get(
    'backgroundPath'
  )
  const background = backgroundPath ? { pathname: backgroundPath } : null

  return (
    <>
      <Routes location={background || location}>
        <Route element={<OnboardedGuardedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="files/:fileTheme" element={<PapersList />} />
          <Route
            path="file/:fileTheme/:fileId"
            element={<FilesViewerWithQuery />}
          />
          <Route path="onboarding" element={<Onboarding />} />
        </Route>
        <Route path="/paper" element={<Navigate to="/" />} />
      </Routes>
      {background && (
        <Routes>
          <Route path="multiselect" element={<MultiselectView />} />
          <Route path="create" element={<PlaceholderListModal />} />
          <Route
            path="create/:qualificationLabel"
            element={<CreatePaperModal />}
          />
          <Route
            path="edit/information/:fileId"
            element={<InformationEdit />}
          />
          <Route path="edit/page/:fileId" element={<PageEdit />} />
          <Route path="edit/contact/:fileId" element={<ContactEdit />} />
        </Routes>
      )}
    </>
  )
}
