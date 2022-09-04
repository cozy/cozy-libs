import React from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'

import Home from './Home/Home'
import MultiselectView from './Multiselect/MultiselectView'
import PapersListWrapper from './Papers/PapersListWrapper'
import FilesViewerWithQuery from './Viewer/FileViewerWithQuery'
import OnboardedGuardedRoute from './OnboardedGuardedRoute'
import PlaceholderListModal from './Placeholders/PlaceholderListModal/PlaceholderListModal'
import CreatePaperModal from './StepperDialog/CreatePaperModal'
import OnboardingWrapper from './Onboarding/OnboardingWrapper'

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
          <Route index element={<Home />} />
          <Route path="files/:fileTheme" element={<PapersListWrapper />} />
          <Route
            path="file/:fileTheme/:fileId"
            element={<FilesViewerWithQuery />}
          />
          <Route path="onboarding" element={<OnboardingWrapper />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      {background && (
        <Routes>
          <Route path="multiselect" element={<MultiselectView />} />
          <Route path="create" element={<PlaceholderListModal />} />
          <Route
            path="create/:qualificationLabel"
            element={<CreatePaperModal />}
          />
        </Routes>
      )}
    </>
  )
}
