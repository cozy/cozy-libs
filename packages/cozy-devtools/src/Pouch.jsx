import format from 'date-fns/format'
import get from 'lodash/get'
import React, { useMemo, useState, useCallback, useEffect } from 'react'

import { useClient } from 'cozy-client'
import CozyPouchLink from 'cozy-pouch-link'
import Button from 'cozy-ui/transpiled/react/Button'
import Typography from 'cozy-ui/transpiled/react/Typography'

import PanelContent from './PanelContent'

const listStyle = { paddingLeft: '1rem' }

const DATE_FORMAT = 'HH:mm:ss DD/MM/YYYY'

const useForceUpdate = () => {
  const [, setLastRender] = useState(null)
  const forceUpdate = useCallback(() => {
    setLastRender(Date.now())
  }, [])
  return forceUpdate
}

const DoctypeSyncInfo = ({ link, doctype }) => {
  const info = link.getSyncInfo(doctype)
  return (
    <div>
      Status: {info ? get(link, ['replicationStatus', doctype]) : 'Not synced'}
      <br />
      Date: {info ? format(info.date, DATE_FORMAT) : 'NA'}
    </div>
  )
}

/**
 * Allows to view state and manage the PouchLink of the current cozy
 * client.
 */
const PouchDevTool = () => {
  const client = useClient()
  const forceUpdate = useForceUpdate()
  const [status, setStatus] = useState('NA')
  const pouchLink = useMemo(() => {
    return client.links.find(link => link instanceof CozyPouchLink)
  }, [client])
  const [resetting, setResetting] = useState(false)
  useEffect(() => {
    const handleReplicationStart = () => setStatus('replicating')
    const handleReplicationStop = () => setStatus('stopped')
    const handleReplicationEnd = () => setStatus('idle')
    client.on('pouchlink:sync:start', handleReplicationStart)
    client.on('pouchlink:sync:stop', handleReplicationStop)
    client.on('pouchlink:sync:end', handleReplicationEnd)
    client.on('pouchlink:doctypesync:start', forceUpdate)
    client.on('pouchlink:doctypesync:end', forceUpdate)
    return () => {
      client.removeListener('pouchlink:sync:start', handleReplicationStart)
      client.removeListener('pouchlink:sync:stop', handleReplicationStop)
      client.removeListener('pouchlink:sync:end', handleReplicationEnd)
      client.removeListener('pouchlink:doctypesync:start', forceUpdate)
      client.removeListener('pouchlink:doctypesync:end', forceUpdate)
    }
  }, [client, forceUpdate])

  const handleClickStartReplication = useCallback(async () => {
    // Need to stop the replication loop before restarting it
    // otherwise startReplication has no effect since the replication
    // loop is already started.
    pouchLink.stopReplication()
    pouchLink.startReplication()
  }, [pouchLink])

  const handleClickStopReplication = useCallback(async () => {
    pouchLink.stopReplication()
  }, [pouchLink])

  const handleClickReset = useCallback(async () => {
    setResetting(true)

    try {
      await pouchLink.reset()
      if (window.confirm('Pouches have been destroyed, reload the page ?')) {
        window.location.reload()
      }
    } catch (e) {
      setResetting(false)
    }
  }, [setResetting, pouchLink])

  if (!pouchLink) {
    return (
      <PanelContent>
        <p>Pouch is not active</p>
      </PanelContent>
    )
  }
  return (
    <PanelContent>
      <Typography variant="subtitle1">Doctypes managed in Pouch</Typography>
      <ul style={listStyle}>
        {pouchLink.doctypes.map(doctype => (
          <li className="u-mb-half" key={doctype}>
            {doctype}
            <DoctypeSyncInfo link={pouchLink} doctype={doctype} />
          </li>
        ))}
      </ul>
      <Typography variant="subtitle1">Actions</Typography>
      <p>
        <Button
          className="u-mb-half"
          variant="contained"
          disabled={status === 'replicating'}
          onClick={handleClickStartReplication}
        >
          Start replication
        </Button>
        <Button
          className="u-mb-half"
          variant="contained"
          disabled={status === 'idle'}
          onClick={handleClickStopReplication}
        >
          Stop replication
        </Button>
        <Button
          className="u-mb-half"
          variant="contained"
          disabled={resetting}
          onClick={handleClickReset}
        >
          Destroy databases
        </Button>
      </p>
    </PanelContent>
  )
}

export default PouchDevTool
