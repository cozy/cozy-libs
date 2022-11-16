import React from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'

import Home from './Views/Home'
import MultiselectView from './Views/MultiselectView'
import PapersListWrapper from './Views/PapersListWrapper'
import FilesViewerWithQuery from './Views/FileViewerWithQuery'
import PlaceholderListModal from './Views/PlaceholderListModal'
import CreatePaperModal from './Views/CreatePaperModal'
import OnboardingWrapper from './Views/OnboardingWrapper'
import InformationEditWrapper from './Views/InformationEditWrapper'
import PageEdit from './Views/PageEdit'
import ContactEditWrapper from './Views/ContactEditWrapper'

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
          <Route path="files/:fileTheme" element={<PapersListWrapper />} />
          <Route
            path="file/:fileTheme/:fileId"
            element={<FilesViewerWithQuery />}
          />
          <Route path="onboarding" element={<OnboardingWrapper />} />
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
            element={<InformationEditWrapper />}
          />
          <Route path="edit/page/:fileId" element={<PageEdit />} />
          <Route path="edit/contact/:fileId" element={<ContactEditWrapper />} />
        </Routes>
      )}
    </>
  )
}
