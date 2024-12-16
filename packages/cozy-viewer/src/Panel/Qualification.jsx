import PropTypes from 'prop-types'
import React, { Fragment, useRef, useState, createRef, useEffect } from 'react'

import { hasQualifications } from 'cozy-client/dist/models/file'
import {
  isExpiringSoon,
  getMetadataQualificationType
} from 'cozy-client/dist/models/paper'
import Divider from 'cozy-ui/transpiled/react/Divider'
import List from 'cozy-ui/transpiled/react/List'
import QualificationModal from 'cozy-ui/transpiled/react/QualificationModal'

import ActionMenuWrapper from './ActionMenuWrapper'
import QualificationListItemContact from './QualificationListItemContact'
import QualificationListItemDate from './QualificationListItemDate'
import QualificationListItemInformation from './QualificationListItemInformation'
import QualificationListItemOther from './QualificationListItemOther'
import QualificationListItemQualification from './QualificationListItemQualification'
import QualificationListItemQualificationEmpty from './QualificationListItemQualificationEmpty'
import {
  makeHideDivider,
  makeFormattedMetadataQualification,
  isExpirationAlertHidden
} from './helpers'
import ExpirationAlert from '../components/ExpirationAlert'
import { withViewerLocales } from '../hoc/withViewerLocales'

const ComponentFromMetadataQualificationType = {
  contact: QualificationListItemContact,
  date: QualificationListItemDate,
  information: QualificationListItemInformation,
  other: QualificationListItemOther,
  bills: QualificationListItemInformation
}

const Qualification = ({ file }) => {
  const { metadata = {} } = file
  const actionBtnRef = useRef([])
  const [showQualifModal, setShowQualifModal] = useState(false)
  const [optionFile, setOptionFile] = useState({
    id: '',
    name: '',
    value: ''
  })
  const formattedMetadataQualification = makeFormattedMetadataQualification(
    file,
    metadata
  )
  const showMetadataList =
    hasQualifications(file) && formattedMetadataQualification.length > 1 // we have at minimum "contact" item

  const hideActionsMenu = () => {
    setOptionFile({ id: '', name: '', value: '' })
  }

  const toggleActionsMenu = (id, name, value) => {
    setOptionFile(prev => {
      if (prev.value) return { id: '', name: '', value: '' }
      return { id, name, value }
    })
  }

  useEffect(() => {
    actionBtnRef.current = formattedMetadataQualification.map(
      (_, idx) => actionBtnRef.current[idx] ?? createRef()
    )
  }, [formattedMetadataQualification])

  return (
    <>
      {isExpiringSoon(file) && !isExpirationAlertHidden(file) && (
        <ExpirationAlert file={file} />
      )}
      {hasQualifications(file) ? (
        <QualificationListItemQualification
          file={file}
          onClick={() => setShowQualifModal(true)}
        />
      ) : (
        <QualificationListItemQualificationEmpty
          onClick={() => setShowQualifModal(true)}
        />
      )}
      {showQualifModal && (
        <QualificationModal
          file={file}
          onClose={() => setShowQualifModal(false)}
        />
      )}
      {showMetadataList && (
        <List>
          {formattedMetadataQualification.map((meta, idx) => {
            const { name } = meta

            const metadataQualificationType = getMetadataQualificationType(name)
            const QualificationListItemComp =
              ComponentFromMetadataQualificationType[metadataQualificationType]

            const hideDivider = makeHideDivider(
              formattedMetadataQualification,
              idx
            )

            return (
              <Fragment key={idx}>
                <QualificationListItemComp
                  file={file}
                  ref={actionBtnRef.current[idx]}
                  formattedMetadataQualification={meta}
                  toggleActionsMenu={val => toggleActionsMenu(idx, name, val)}
                />
                {!hideDivider && <Divider component="li" variant="inset" />}
              </Fragment>
            )
          })}
          {optionFile.name && (
            <ActionMenuWrapper
              onClose={hideActionsMenu}
              file={file}
              optionFile={optionFile}
              ref={actionBtnRef.current[optionFile.id]}
            />
          )}
        </List>
      )}
    </>
  )
}

Qualification.propTypes = {
  file: PropTypes.object.isRequired
}

export default withViewerLocales(Qualification)
