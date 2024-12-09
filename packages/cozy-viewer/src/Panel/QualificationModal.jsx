import React from 'react'

import { useClient } from 'cozy-client'
import { themesList } from 'cozy-client/dist/models/document/documentTypeData'
import { isQualificationNote } from 'cozy-client/dist/models/document/documentTypeDataHelpers'
import { getBoundT } from 'cozy-client/dist/models/document/locales'
import { getQualification } from 'cozy-client/dist/models/document/qualification'
import Icon from 'cozy-ui/transpiled/react/Icon'
import FileDuotoneIcon from 'cozy-ui/transpiled/react/Icons/FileDuotone'
import FileTypeNoteIcon from 'cozy-ui/transpiled/react/Icons/FileTypeNote'
import NestedSelectResponsive from 'cozy-ui/transpiled/react/NestedSelect/NestedSelectResponsive'
import QualificationIconStack from 'cozy-ui/transpiled/react/QualificationIconStack'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { withViewerLocales } from '../hoc/withViewerLocales'

const makeOptions = lang => {
  const qualifT = getBoundT(lang)

  return {
    children: [
      {
        id: 'none',
        title: qualifT('Scan.themes.none'),
        icon: <Icon icon={FileDuotoneIcon} color="#E049BF" size={32} />
      },
      ...themesList.map(theme => ({
        id: theme.id,
        title: qualifT(`Scan.themes.${theme.label}`),
        icon: <QualificationIconStack theme={theme.label} />,
        children: theme.items.map(item => ({
          id: item.label,
          item,
          title: qualifT(`Scan.items.${item.label}`),
          icon: isQualificationNote(item) ? (
            <Icon icon={FileTypeNoteIcon} size={64} />
          ) : (
            <QualificationIconStack qualification={item.label} />
          )
        }))
      }))
    ]
  }
}

const QualificationListItemQualificationEmpty = ({ file, t, onClose }) => {
  const client = useClient()
  const { lang } = useI18n()
  const qualificationLabel = getQualification(file)?.label

  const options = makeOptions(lang)

  const isSelected = ({ id, item }) => {
    return qualificationLabel
      ? qualificationLabel === item?.label
      : id === 'none'
  }

  const handleClick = async ({ id, item }) => {
    const fileCollection = client.collection('io.cozy.files')
    const removeQualification = qualificationLabel && id === 'none'

    if (!qualificationLabel && removeQualification) {
      return onClose()
    }

    /*
      In the case where we remove the qualification it's necessary to define the attribute to `null` and not `undefined`, with `undefined` the stack does not return the attribute and today the Redux store is not updated for a missing attribute.
      As a result, the UI is not updated and continues to display the qualification on the document, even though it has been deleted in CouchDB.
    */
    await fileCollection.updateMetadataAttribute(file._id, {
      qualification: removeQualification ? null : item
    })

    onClose()
  }

  return (
    <NestedSelectResponsive
      title={t('Viewer.panel.qualification.empty.primary')}
      options={options}
      noDivider
      document={file}
      isSelected={isSelected}
      onSelect={handleClick}
      onClose={onClose}
    />
  )
}

export default withViewerLocales(QualificationListItemQualificationEmpty)
