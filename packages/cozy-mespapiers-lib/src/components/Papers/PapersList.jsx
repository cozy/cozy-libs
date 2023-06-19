import PropTypes from 'prop-types'
import React, { useState } from 'react'

import flag from 'cozy-flags'
import Button from 'cozy-ui/transpiled/react/Buttons'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import HarvestBanner from './HarvestBanner'
import { makeAccountFromPapers } from './helpers'
import PaperLine from '../Papers/PaperLine'

const PapersList = ({ papers, konnector, accounts, isLast }) => {
  const { t } = useI18n()
  const [maxDisplay, setMaxDisplay] = useState(papers.maxDisplay)
  const [paperBeingRenamedId, setPaperBeingRenamedId] = useState(null)

  const account = makeAccountFromPapers(papers, accounts)

  const handleClick = () => {
    setMaxDisplay(papers.list.length)
  }

  return (
    <>
      {flag('harvest.inappconnectors.enabled') && (
        <HarvestBanner konnector={konnector} account={account} />
      )}
      {papers.list.map(
        (paper, idx) =>
          idx + 1 <= maxDisplay && (
            <PaperLine
              key={paper.id}
              paper={paper}
              hasDivider={idx !== papers.list.length - 1}
              isRenaming={paper.id === paperBeingRenamedId}
              setIsRenaming={isRenaming =>
                setPaperBeingRenamedId(isRenaming ? paper.id : null)
              }
              isLast={isLast}
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
  konnector: PropTypes.object,
  accounts: PropTypes.array,
  isLast: PropTypes.bool
}

export default PapersList
