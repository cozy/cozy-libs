import format from 'date-fns/format'
import get from 'lodash/get'
import overEvery from 'lodash/overEvery'
import sortBy from 'lodash/sortBy'
import React, { useState, useMemo, useCallback } from 'react'
import { TableInspector, ObjectInspector } from 'react-inspector'

import Box from 'cozy-ui/transpiled/react/Box'
import Grid from 'cozy-ui/transpiled/react/Grid'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Paper from 'cozy-ui/transpiled/react/Paper'
import Table from 'cozy-ui/transpiled/react/Table'
import TableBody from 'cozy-ui/transpiled/react/TableBody'
import MuiTableCell from 'cozy-ui/transpiled/react/TableCell'
import TableContainer from 'cozy-ui/transpiled/react/TableContainer'
import TableRow from 'cozy-ui/transpiled/react/TableRow'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { withStyles } from 'cozy-ui/transpiled/react/styles'

import PanelContent from './PanelContent'
import { NavSecondaryAction, ListGridItem } from './common'

/**
 * @type {Object.<string, React.CSSProperties>}
 * @private
 */
const styles = {
  panelRight: { height: '100%', overflow: 'scroll', flexGrow: 1 },
  mono: { fontFamily: 'monospace' },
  input: { width: 400 }
}

const TableCell = withStyles({
  root: {
    fontFamily: 'inherit',
    fontSize: 'small'
  }
})(MuiTableCell)

const getClassNameForExecutedTimesQuery = time => {
  if (time <= 100) {
    return 'u-valid u-success'
  } else if (time > 100 && time < 250) {
    return 'u-warn u-warning'
  } else {
    return 'u-danger u-error'
  }
}

/**
 * @param  {{ queryState: import("../types").QueryState }} props - Query state containing fetchStatus, lastError
 */
const FetchStatus = props => {
  const { queryState } = props
  const { fetchStatus, lastError } = queryState
  return (
    <span
      className={
        fetchStatus === 'loaded'
          ? 'u-valid'
          : fetchStatus === 'pending'
          ? 'u-warn'
          : fetchStatus === 'failed'
          ? 'u-error'
          : ''
      }
    >
      {fetchStatus}
      {fetchStatus === 'failed' ? ` - ${lastError}` : null}
    </span>
  )
}

/**
 * @param  {{ queryState: import("../types").QueryState }} props - Query state containing definition
 */
const IndexedFields = props => {
  const { queryState } = props
  const { indexedFields } = queryState.definition
  return (
    <span className="u-primaryColor">
      {indexedFields ? indexedFields.join(', ') : null}
    </span>
  )
}

/**
 * @param  {string} search - Search string
 * @returns {function(import("../types").CozyClientDocument): Boolean}
 */
const makeMatcher = search => {
  const specs = search.split(';')
  const conditions = specs.map(spec => {
    const [key, value] = spec.split(':')
    return obj => {
      if (!value) {
        return false
      }
      const attr = get(obj, key)
      return attr && attr.toString().toLowerCase().includes(value.toLowerCase())
    }
  })
  return overEvery(conditions)
}

const QueryData = ({ client, data, doctype }) => {
  const [showTable, setShowTable] = useState(false)
  const documents = client.store.getState().cozy.documents[doctype]

  const storeData = useMemo(() => {
    return data.map(id => client.hydrateDocument(documents[id]))
  }, [client, data, documents])

  const handleShowTable = useCallback(
    () => setShowTable(value => !value),
    [setShowTable]
  )

  const [results, setResults] = useState(null)
  const [search, setSearch] = useState('')
  const handleSearch = useCallback(
    ev => {
      const searchValue = ev.target.value
      const matcher = searchValue !== '' ? makeMatcher(searchValue) : null
      const results = matcher ? storeData.filter(matcher) : null
      setSearch(searchValue)
      setResults(results)
    },
    [storeData]
  )

  const viewData = results || storeData

  return (
    <div className="u-pb-3">
      Table:{' '}
      <input type="checkbox" onChange={handleShowTable} checked={showTable} />
      <br />
      Search:{' '}
      <input
        type="text"
        placeholder="field.nested_field:value;other_field:other_value"
        onChange={handleSearch}
        value={search}
        style={styles.input}
      />
      <br />
      {showTable ? (
        <TableInspector data={viewData} />
      ) : (
        <ObjectInspector data={viewData} />
      )}
    </div>
  )
}

const ObjectInspectorAndStringificator = ({ object }) => {
  const [showStringify, setShowStringify] = useState(false)
  const handleStringify = useCallback(
    () => setShowStringify(value => !value),
    [setShowStringify]
  )
  return (
    <>
      Stringify:{' '}
      <input
        type="checkbox"
        onChange={handleStringify}
        checked={showStringify}
      />
      {showStringify ? (
        <pre>{JSON.stringify(object, null, 2)}</pre>
      ) : (
        <ObjectInspector data={object} />
      )}
    </>
  )
}

const QueryStateView = ({ client, name }) => {
  /**
   * @type {import("../types").QueryState}
   */
  const queryState = client.store.getState().cozy.queries[name]
  const { data, options } = queryState
  const { lastFetch, lastUpdate } = useMemo(() => {
    return {
      lastFetch: new Date(queryState.lastFetch),
      lastUpdate: new Date(queryState.lastUpdate)
    }
  }, [queryState])

  return (
    <>
      <TableContainer component={Paper} elevation={0}>
        <Table style={styles.mono} size="small" className="u-w-auto">
          <TableBody>
            <TableRow>
              <TableCell>doctype</TableCell>
              <TableCell>{queryState.definition.doctype}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>definition</TableCell>
              <TableCell>
                <ObjectInspectorAndStringificator
                  object={queryState.definition}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>indexFields</TableCell>
              <TableCell>
                <IndexedFields queryState={queryState} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>fetchStatus</TableCell>
              <TableCell>
                <FetchStatus queryState={queryState} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>lastFetch</TableCell>
              <TableCell>{format(lastFetch, 'HH:mm:ss')}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>lastUpdate</TableCell>
              <TableCell>{format(lastUpdate, 'HH:mm:ss')}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>documents</TableCell>
              <TableCell>
                {data && data.length !== undefined ? data.length : data ? 1 : 0}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>autoUpdate</TableCell>
              <TableCell>
                {options && options.autoUpdate
                  ? JSON.stringify(options.autoUpdate)
                  : 'null'}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>execution stats</TableCell>
              <TableCell>
                <ObjectInspectorAndStringificator
                  object={queryState.execution_stats}
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <QueryData
        client={client}
        data={data}
        doctype={queryState.definition.doctype}
      />
    </>
  )
}

const QueryListItem = ({ name, selected, client, onClick }) => {
  const queryState = client.store.getState().cozy.queries[name]
  const lastUpdate = useMemo(
    () => format(new Date(queryState.lastUpdate), 'HH:mm:ss'),
    [queryState]
  )

  return (
    <ListItem dense button selected={selected} onClick={onClick}>
      <ListItemText
        primary={name}
        secondary={
          <>
            {queryState.fetchStatus === 'failed' ? (
              <>
                <span className="u-error">failed</span> -{' '}
              </>
            ) : null}
            {queryState.execution_stats && (
              <>
                <ExecutionTime queryState={queryState} /> -{' '}
              </>
            )}
            {lastUpdate ? <>{lastUpdate} -</> : null}
            {queryState.data.length} docs
          </>
        }
      />
      <NavSecondaryAction />
    </ListItem>
  )
}

const ExecutionTime = ({ queryState }) => {
  if (!queryState.execution_stats) return null
  const classCSS = getClassNameForExecutedTimesQuery(
    queryState.execution_stats.execution_time_ms
  )
  return (
    <span className={classCSS}>
      {Math.round(queryState.execution_stats.execution_time_ms)} ms
    </span>
  )
}

const QueryPanels = ({ client }) => {
  const queries = client.store.getState().cozy.queries

  const sortedQueries = useMemo(() => {
    return sortBy(queries ? Object.values(queries) : [], queryState =>
      Math.max(
        queryState.lastUpdate || -Infinity,
        queryState.lastErrorUpdate || -Infinity
      )
    )
      .map(queryState => queryState.id)
      .reverse()
  }, [queries])

  const [selectedQuery, setSelectedQuery] = useState(() => sortedQueries[0])

  return (
    <>
      <ListGridItem>
        {sortedQueries.map(queryName => {
          return (
            <QueryListItem
              client={client}
              name={queryName}
              key={queryName}
              onClick={() => setSelectedQuery(queryName)}
              selected={name === selectedQuery}
            />
          )
        })}
        {sortedQueries.length === 0 ? (
          <PanelContent>
            <Typography variant="body1">No queries yet.</Typography>
          </PanelContent>
        ) : null}
      </ListGridItem>
      <Box clone p={1} minWidth={400}>
        <Grid item style={styles.panelRight}>
          <Typography variant="subtitle1">{selectedQuery}</Typography>
          {selectedQuery ? (
            <QueryStateView client={client} name={selectedQuery} />
          ) : null}
        </Grid>
      </Box>
    </>
  )
}

export default QueryPanels
