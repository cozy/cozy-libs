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
import InformationEditWrapper from './ModelSteps/Edit/InformationEditWrapper'
import PageEdit from './ModelSteps/Edit/PageEdit'
import ContactEditWrapper from './ModelSteps/Edit/ContactEditWrapper'

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
