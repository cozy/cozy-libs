import get from 'lodash/get'

import { isNote, isDocs } from 'cozy-client/dist/models/file'
import ContactsIcon from 'cozy-ui/transpiled/react/Icons/Contacts'
import IconAudio from 'cozy-ui/transpiled/react/Icons/FileTypeAudio'
import IconBin from 'cozy-ui/transpiled/react/Icons/FileTypeBin'
import IconCode from 'cozy-ui/transpiled/react/Icons/FileTypeCode'
import IconFiles from 'cozy-ui/transpiled/react/Icons/FileTypeFiles'
import IconFolder from 'cozy-ui/transpiled/react/Icons/FileTypeFolder'
import IconImage from 'cozy-ui/transpiled/react/Icons/FileTypeImage'
import IconNote from 'cozy-ui/transpiled/react/Icons/FileTypeNote'
import IconPdf from 'cozy-ui/transpiled/react/Icons/FileTypePdf'
import IconSheet from 'cozy-ui/transpiled/react/Icons/FileTypeSheet'
import IconSlide from 'cozy-ui/transpiled/react/Icons/FileTypeSlide'
import IconText from 'cozy-ui/transpiled/react/Icons/FileTypeText'
import IconVideo from 'cozy-ui/transpiled/react/Icons/FileTypeVideo'
import IconZip from 'cozy-ui/transpiled/react/Icons/FileTypeZip'

import IconDocs from './Icons/DocsIcon'
import EncryptedFolderIcon from './Icons/EncryptedFolderIcon'
import { getFileMimetype } from './getFileMimetype'

export const getIconForSearchResult = searchResult => {
  if (searchResult.doc._type === 'io.cozy.apps') {
    return {
      type: 'app',
      app: searchResult.doc
    }
  }

  if (searchResult.slug === 'notes') {
    return {
      type: 'component',
      component: IconNote
    }
  }

  if (searchResult.slug === 'drive') {
    return {
      type: 'component',
      component: getDriveMimeTypeIcon(searchResult.doc)
    }
  }

  if (searchResult.slug === 'contacts') {
    return {
      type: 'component',
      component: ContactsIcon
    }
  }

  return {
    type: 'component',
    component: IconFiles
  }
}

/**
 * Returns the appropriate icon for a given file based on its mime type and other properties.
 *
 * This method has been copied from cozy-drive
 *
 * See source: https://github.com/cozy/cozy-drive/blob/fbe2df67199683b23a40f476ccdacb00ee027459/src/lib/getMimeTypeIcon.js
 *
 * @param {import('cozy-client/types/types').IOCozyFile} file - The io.cozy.files .
 * @param {Object} [options] - Additional options.
 * @param {boolean} [options.isEncrypted] - Indicates whether the file is encrypted. Default is false.
 * @returns {import('react').ReactNode} - The icon corresponding to the file's mime type.
 */
export const getDriveMimeTypeIcon = (file, { isEncrypted = false } = {}) => {
  const isDirectory = file.type === 'directory'
  const { name, mime } = file
  if (isEncrypted) {
    return EncryptedFolderIcon
  }
  if (isDirectory) {
    return IconFolder
  } else if (isNote(file)) {
    return IconNote
  } else if (isDocs(file)) {
    return IconDocs
  } else {
    const iconsByMimeType = {
      audio: IconAudio,
      bin: IconBin,
      code: IconCode,
      image: IconImage,
      pdf: IconPdf,
      slide: IconSlide,
      sheet: IconSheet,
      text: IconText,
      video: IconVideo,
      zip: IconZip
    }
    const type = getFileMimetype(iconsByMimeType)(mime, name)
    return get(iconsByMimeType, type, IconFiles)
  }
}
