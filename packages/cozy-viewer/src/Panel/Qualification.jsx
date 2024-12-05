import PropTypes from 'prop-types'
import React, {
  Fragment,
  useRef,
  useState,
  createRef,
  useMemo,
  useEffect
} from 'react'

import {
  isExpiringSoon,
  formatMetadataQualification,
  KNOWN_BILLS_ATTRIBUTES_NAMES,
  getMetadataQualificationType
} from 'cozy-client/dist/models/paper'
import Divider from 'cozy-ui/transpiled/react/Divider'
import List from 'cozy-ui/transpiled/react/List'

import ActionMenuWrapper from './ActionMenuWrapper'
import QualificationListItemContact from './QualificationListItemContact'
import QualificationListItemDate from './QualificationListItemDate'
import QualificationListItemInformation from './QualificationListItemInformation'
import QualificationListItemOther from './QualificationListItemOther'
import QualificationListItemQualification from './QualificationListItemQualification'
import { makeHideDivider } from './helpers'
import ExpirationAlert from '../components/ExpirationAlert'
import { withViewerLocales } from '../hoc/withViewerLocales'

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
  const [optionFile, setOptionFile] = useState({
    id: '',
    name: '',
    value: ''
  })

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

  return (
    <>
      {isExpiringSoon(file) && !isExpirationAlertHidden(file) && (
        <ExpirationAlert file={file} />
      )}
      <QualificationListItemQualification
        file={file}
        ref={actionBtnRef.current[0]}
        formattedMetadataQualification={formattedMetadataQualification[0]}
        toggleActionsMenu={val =>
          toggleActionsMenu(0, formattedMetadataQualification[0].name, val)
        }
      />
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
              {!hideDivider && <Divider variant="inset" />}
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
    </>
  )
}

Qualification.propTypes = {
  file: PropTypes.object.isRequired
}

export default withViewerLocales(Qualification)
