import PropTypes from 'prop-types'
import React, {
  Fragment,
  useRef,
  useState,
  createRef,
  useMemo,
  useEffect
} from 'react'

import { hasQualifications } from 'cozy-client/dist/models/file'
import {
  isExpiringSoon,
  formatMetadataQualification,
  KNOWN_BILLS_ATTRIBUTES_NAMES,
  formatContactValue,
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
import { makeHideDivider } from './helpers'
import ExpirationAlert from '../components/ExpirationAlert'
import { withViewerLocales } from '../hoc/withViewerLocales'
import useReferencedContactName from '../hooks/useReferencedContactName'

const ComponentFromMetadataQualificationType = {
  contact: QualificationListItemContact,
  date: QualificationListItemDate,
  information: QualificationListItemInformation,
  other: QualificationListItemOther,
  bills: QualificationListItemInformation
}

const isExpirationAlertHidden = file => {
  return file?.metadata?.hideExpirationAlert ?? false
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
  const { contacts } = useReferencedContactName(file)
  const formattedContactValue = formatContactValue(contacts)

  const hideActionsMenu = () => {
    setOptionFile({ id: '', name: '', value: '' })
  }

  const toggleActionsMenu = (id, name, value) => {
    setOptionFile(prev => {
      if (prev.value) return { id: '', name: '', value: '' }
      return { id, name, value }
    })
  }

  const formattedMetadataQualification = useMemo(() => {
    const relatedBills = file.bills?.data?.[0]
    const formattedMetadataQualification = formatMetadataQualification(
      metadata
    ).sort((a, b) =>
      a.name === 'qualification' ? -1 : b.name === 'qualification' ? 1 : 0
    ) // move "qualification" metadata in first position

    if (relatedBills) {
      const formattedBillsMetadata = KNOWN_BILLS_ATTRIBUTES_NAMES.map(
        attrName => ({ name: attrName, value: relatedBills[attrName] })
      )

      return formattedMetadataQualification.concat(formattedBillsMetadata)
    }

    return formattedMetadataQualification
  }, [metadata, file.bills?.data])

  useEffect(() => {
    actionBtnRef.current = formattedMetadataQualification.map(
      (_, idx) => actionBtnRef.current[idx] ?? createRef()
    )
  }, [formattedMetadataQualification])

  const showMetadataList =
    hasQualifications(file) &&
    (formattedMetadataQualification.length !== 2 || formattedContactValue) // we have at minimum "qualification" and "contact" item

  return (
    <>
      {isExpiringSoon(file) && !isExpirationAlertHidden(file) && (
        <ExpirationAlert file={file} />
      )}
      {hasQualifications(file) ? (
        <QualificationListItemQualification
          formattedMetadataQualification={formattedMetadataQualification[0]}
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
            if (name === 'qualification') return null

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
