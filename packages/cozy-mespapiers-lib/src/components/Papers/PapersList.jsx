import React, { useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import flag from 'cozy-flags'

import { useClient } from 'cozy-client'
import Button from 'cozy-ui/transpiled/react/Buttons'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import PaperLine from '../Papers/PaperLine'
import { useModal } from '../Hooks/useModal'
import { select } from '../Actions/Items/select'
import { hr } from '../Actions/Items/hr'
import { trash } from '../Actions/Items/trash'
import { open } from '../Actions/Items/open'
import { rename } from '../Actions/Items/rename'
import { viewInDrive } from '../Actions/Items/viewInDrive'
import { makeActionVariant, makeActions } from '../Actions/utils'
import { useMultiSelection } from '../Hooks/useMultiSelection'
import HarvestBanner from './HarvestBanner'

const PapersList = ({ papers, connector, accounts, isLast }) => {
  const client = useClient()
  const { t } = useI18n()
  const { pushModal, popModal } = useModal()
  const [maxDisplay, setMaxDisplay] = useState(papers.maxDisplay)
  const { addMultiSelectionFile } = useMultiSelection()
  const [paperBeingRenamedId, setPaperBeingRenamedId] = useState(null)

  const actionVariant = makeActionVariant()
  const actions = useMemo(
    () =>
      makeActions(
        [
          select,
          hr,
          ...actionVariant,
          open,
          hr,
          rename,
          hr,
          viewInDrive,
          hr,
          trash
        ],
        {
          client,
          addMultiSelectionFile,
          pushModal,
          popModal,
          setPaperBeingRenamedId
        }
      ),
    [actionVariant, client, addMultiSelectionFile, popModal, pushModal]
  )
  const accountLogin = papers?.list?.[0]?.cozyMetadata?.sourceAccountIdentifier
  const account = accounts?.find(
    account => account?.auth?.login === accountLogin
  )

  const handleClick = () => {
    setMaxDisplay(papers.list.length)
  }

  return (
    <>
      {flag('harvest.inappconnectors.enabled') && (
        <HarvestBanner connector={connector} account={account} />
      )}
      {papers.list.map(
        (paper, idx) =>
          idx + 1 <= maxDisplay && (
            <PaperLine
              key={paper.id}
              paper={paper}
              divider={idx !== papers.list.length - 1}
              actions={actions}
              isRenaming={paper.id === paperBeingRenamedId}
              isLast={isLast}
              setIsRenaming={isRenaming =>
                setPaperBeingRenamedId(isRenaming ? paper.id : null)
              }
            />
          )
      )}
      {maxDisplay < papers.list.length && (
        <Button
          className="u-mh-1 u-mv-half"
          variant="text"
          label={t(`PapersList.PapersListByContact.seeMore`, {
            number: papers.list.length - maxDisplay
          })}
          size="small"
          onClick={handleClick}
        />
      )}
    </>
  )
}

PapersList.propTypes = {
  papers: PropTypes.shape({
    maxDisplay: PropTypes.number,
    list: PropTypes.arrayOf(PropTypes.object)
  }),
  connector: PropTypes.object,
  accounts: PropTypes.array,
  isLast: PropTypes.bool
}

export default PapersList
