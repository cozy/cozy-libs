import React, { useMemo, useState } from 'react'
import PropTypes from 'prop-types'

import { useClient } from 'cozy-client'
import Button from 'cozy-ui/transpiled/react/Button'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import PaperLine from '../Papers/PaperLine'
import makeActions from '../Actions/makeActions'
import { useModal } from '../Hooks/useModal'
import { hr, trash, open, viewInDrive } from '../Actions/Actions'
import { makeActionVariant } from '../Actions/utils'

const PapersList = ({ papers }) => {
  const client = useClient()
  const { t } = useI18n()
  const { pushModal, popModal } = useModal()
  const [maxDisplay, setMaxDisplay] = useState(papers.maxDisplay)

  const actionVariant = makeActionVariant()
  const actions = useMemo(
    () =>
      makeActions([...actionVariant, viewInDrive, open, hr, trash], {
        client,
        pushModal,
        popModal
      }),
    [actionVariant, client, popModal, pushModal]
  )

  const handleClick = () => {
    setMaxDisplay(papers.list.length)
  }

  return (
    <div className={'u-pv-half'}>
      {papers.list.map(
        (paper, idx) =>
          idx + 1 <= maxDisplay && (
            <PaperLine
              key={idx}
              paper={paper}
              divider={idx !== papers.list.length - 1}
              actions={actions}
            />
          )
      )}
      {maxDisplay < papers.list.length && (
        <Button
          theme={'text'}
          className={'u-mh-0 u-mv-half'}
          label={t(`PapersList.PapersListByContact.seeMore`, {
            number: papers.list.length - maxDisplay
          })}
          size={'small'}
          onClick={handleClick}
        />
      )}
    </div>
  )
}

PapersList.propTypes = {
  papers: PropTypes.shape({
    maxDisplay: PropTypes.number,
    list: PropTypes.arrayOf(PropTypes.object)
  })
}

export default PapersList
