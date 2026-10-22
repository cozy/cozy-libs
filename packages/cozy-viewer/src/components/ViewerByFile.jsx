import PropTypes from 'prop-types'
import React, { useMemo } from 'react'

import { isPlainText } from 'cozy-client/dist/models/file'
import withBreakpoints from 'cozy-ui/transpiled/react/helpers/withBreakpoints'

import NoViewer from '../NoViewer'
import AudioViewer from '../ViewersByFile/AudioViewer'
import BlankPaperViewer from '../ViewersByFile/BlankPaperViewer'
import ImageViewer from '../ViewersByFile/ImageViewer'
import OnlyOfficeViewer from '../ViewersByFile/OnlyOfficeViewer'
import PdfJsViewer from '../ViewersByFile/PdfJsViewer'
import PdfMobileViewer from '../ViewersByFile/PdfMobileViewer'
import ShortcutViewer from '../ViewersByFile/ShortcutViewer'
import TextViewer from '../ViewersByFile/TextViewer'
import VideoViewer from '../ViewersByFile/VideoViewer'
import { useViewer } from '../providers/ViewerProvider'

const isBlankPaper = doc => doc.metadata?.paperProps?.isBlank

export const getViewerComponentName = ({
  file,
  isDesktop,
  isOnlyOfficeEnabled
}) => {
  switch (file.class) {
    case 'shortcut':
      return ShortcutViewer
    case 'image':
      return ImageViewer
    case 'audio':
      return AudioViewer
    case 'video':
      return VideoViewer
    case 'pdf':
      return isBlankPaper(file)
        ? BlankPaperViewer
        : isDesktop
          ? PdfJsViewer
          : PdfMobileViewer
    case 'text':
      return isPlainText(file.mime, file.name)
        ? TextViewer
        : isOnlyOfficeEnabled
          ? OnlyOfficeViewer
          : NoViewer
    case 'slide':
      return isOnlyOfficeEnabled ? OnlyOfficeViewer : NoViewer
    case 'spreadsheet':
      return isOnlyOfficeEnabled ? OnlyOfficeViewer : NoViewer
    default:
      return NoViewer
  }
}

const ViewerByFile = withBreakpoints()(({
  onClose,
  renderFallbackExtraContent,
  gestures,
  gesturesRef,
  onSwipe,
  breakpoints: { isDesktop },
  componentsProps
}) => {
  const { file, isReadOnly } = useViewer()
  const isOnlyOfficeEnabled = componentsProps?.OnlyOfficeViewer?.isEnabled
  const onlyOfficeOpener = componentsProps?.OnlyOfficeViewer?.opener
  const isPdfEditorEnabled = componentsProps?.PdfViewer?.isPdfEditorEnabled
  const editPdfOpener = componentsProps?.PdfViewer?.opener

  const ComponentName = useMemo(
    () =>
      getViewerComponentName({
        file,
        isDesktop,
        isOnlyOfficeEnabled
      }),
    [file, isDesktop, isOnlyOfficeEnabled]
  )

  return (
    <ComponentName
      file={file}
      renderFallbackExtraContent={renderFallbackExtraContent}
      gestures={gestures}
      gesturesRef={gesturesRef}
      onlyOfficeOpener={onlyOfficeOpener}
      isReadOnly={isReadOnly}
      isPdfEditorEnabled={isPdfEditorEnabled}
      editPdfOpener={editPdfOpener}
      onSwipe={onSwipe}
      onClose={onClose}
    />
  )
})

ViewerByFile.propTypes = {
  onClose: PropTypes.func.isRequired,
  renderFallbackExtraContent: PropTypes.func,
  // gestures, gesturesRef and onSwipe are got from ViewerControls
  gestures: PropTypes.object,
  gesturesRef: PropTypes.object,
  onSwipe: PropTypes.func,
  componentsProps: PropTypes.object
}

ViewerByFile.displayName = 'ViewerByFile'

export default ViewerByFile
