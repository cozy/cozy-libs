/**
 * @TODO Remove when https://github.com/cozy/cozy-ui/issues/1768 has been solved
 */

import IconAudio from 'cozy-ui/transpiled/react/Icons/FileTypeAudio'
import IconBin from 'cozy-ui/transpiled/react/Icons/FileTypeBin'
import IconCode from 'cozy-ui/transpiled/react/Icons/FileTypeCode'
import IconImage from 'cozy-ui/transpiled/react/Icons/FileTypeImage'
import IconPdf from 'cozy-ui/transpiled/react/Icons/FileTypePdf'
import IconSlide from 'cozy-ui/transpiled/react/Icons/FileTypeSlide'
import IconSheet from 'cozy-ui/transpiled/react/Icons/FileTypeSheet'
import IconText from 'cozy-ui/transpiled/react/Icons/FileTypeText'
import IconVideo from 'cozy-ui/transpiled/react/Icons/FileTypeVideo'
import IconZip from 'cozy-ui/transpiled/react/Icons/FileTypeZip'

const iconsBySubType = {
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

const mappingMimetypeSubtype = {
  word: 'text',
  text: 'text',
  zip: 'zip',
  pdf: 'pdf',
  spreadsheet: 'sheet',
  excel: 'sheet',
  sheet: 'sheet',
  presentation: 'slide',
  powerpoint: 'slide'
}

export const getFileSubtype = file => {
  const mimetype = file.mime === 'application/octet-stream' ? 'text' : file.mime
  const [type, subtype] = mimetype.split('/')
  if (type === 'application') {
    const existingType = subtype.match(
      Object.keys(mappingMimetypeSubtype).join('|')
    )
    return existingType ? mappingMimetypeSubtype[existingType[0]] : undefined
  }
  return undefined
}

export const getFileIcon = file => {
  const subtype =
    mappingMimetypeSubtype[file.class] || mappingMimetypeSubtype.text
  return iconsBySubType[subtype]
}
