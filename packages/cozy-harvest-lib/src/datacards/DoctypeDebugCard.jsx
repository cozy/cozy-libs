import PropTypes from 'prop-types'
import React from 'react'
import ReactJsonPrint from 'react-json-print'

import CozyClient, { Q, useQuery, hasQueryBeenLoaded } from 'cozy-client'
import Button from 'cozy-ui/transpiled/react/Buttons'
import Card from 'cozy-ui/transpiled/react/Card'
import Divider from 'cozy-ui/transpiled/react/Divider'
import Typography from 'cozy-ui/transpiled/react/Typography'

import logger from '../logger'

/**
 * This component display json extracted doctype data
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.doctype - The doctype name
 * @param {Array} props.data - The array of doctype values
 * @returns {JSX.Element} The rendered DoctypeDebugCard component.
 */
const DoctypeDebugCard = ({ sourceAccountIdentifier, konnector, doctype }) => {
  const savedDocuments = useQuery(
    Q(doctype)
      .where({
        cozyMetadata: {
          createdByApp: konnector.slug,
          sourceAccountIdentifier
        }
      })
      .indexFields([
        'cozyMetadata.createdByApp',
        'cozyMetadata.sourceAccountIdentifier',
        'cozyMetadata.updatedAt'
      ])
      .sortBy([
        { 'cozyMetadata.createdByApp': 'desc' },
        { 'cozyMetadata.sourceAccountIdentifier': 'desc' },
        { 'cozyMetadata.updatedAt': 'desc' }
      ])
      .limitBy(30),
    {
      as: `${doctype}/createdByApp/${konnector.slug}/sourceAccountIdentifier/${sourceAccountIdentifier}`,
      fetchPolicy: CozyClient.fetchPolicies.olderThan(30 * 1000)
    }
  )
  const loaded = hasQueryBeenLoaded(savedDocuments)
  const failed = savedDocuments.fetchStatus === 'failed'
  if (failed) {
    logger.error(`DoctypeDebugCard ${doctype} : failed to fetch`)
  }

  const clipBoardAvailable = navigator.clipboard?.writeText
  return !failed && loaded ? (
    <Card>
      <Typography variant="button">{doctype}</Typography>
      {clipBoardAvailable ? (
        <Button
          label="copy"
          variant="text"
          size="small"
          onClick={() =>
            navigator.clipboard
              .writeText(JSON.stringify(savedDocuments.data, null, 2))
              .catch(err =>
                logger.error(
                  `Could not copy json object to clipboard: ${err.message}`
                )
              )
          }
        />
      ) : null}
      <Divider className="u-ml-0 u-maw-100 u-mb-half" />
      <ReactJsonPrint dataObject={savedDocuments.data} />
    </Card>
  ) : null
}

DoctypeDebugCard.propTypes = {
  sourceAccountIdentifier: PropTypes.string,
  konnector: PropTypes.object,
  doctype: PropTypes.string
}

export default DoctypeDebugCard
