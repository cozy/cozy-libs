import React, { useCallback, useMemo, useRef } from 'react'

import { useClient } from 'cozy-client'
import Box from 'cozy-ui/transpiled/react/Box'
import Fab from 'cozy-ui/transpiled/react/Fab'
import Grid from 'cozy-ui/transpiled/react/Grid'
import Icon from 'cozy-ui/transpiled/react/Icon'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import CrossMedium from 'cozy-ui/transpiled/react/Icons/CrossMedium'
import GearIcon from 'cozy-ui/transpiled/react/Icons/Gear'
import List from 'cozy-ui/transpiled/react/List'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Paper from 'cozy-ui/transpiled/react/Paper'
import Slide from 'cozy-ui/transpiled/react/Slide'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { useTheme, makeStyles } from 'cozy-ui/transpiled/react/styles'

import Flags from './Flags/Flags'
import LibraryVersions from './LibraryVersions'
import Queries from './Queries'
import { NavSecondaryAction, ListGridItem } from './common'
import { useLocalState } from './useLocalState'

const ABOVE_ALL = 1000000
const DEFAULT_PANEL_HEIGHT = 300

const useStyles = makeStyles(theme => ({
  fab: {
    position: 'fixed',
    left: '1rem',
    bottom: '1rem',
    zIndex: ABOVE_ALL
  },
  panel: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: ABOVE_ALL
  },
  closeIcon: {
    position: 'absolute',
    top: '0',
    right: '0.5rem',
    transform: 'translateY(-66%)',
    background: 'var(--paperBackgroundColor)',
    border: `2px solid ${theme.palette.primary.main}`,
    boxShadow: 'var(--shadow1)',
    zIndex: 1,
    '&:hover': {
      background: 'var(--paperBackgroundColor)'
    }
  },
  panelContainer: {
    background: 'var(--paperBackgroundColor)',
    height: '100%',
    flexWrap: 'nowrap',
    overflowX: 'scroll'
  },
  panelRight: {
    height: '100%',
    overflowY: 'scroll',
    flexGrow: 1,
    minWidth: 150
  },
  mono: { fontFamily: 'monospace' }
}))

const defaultPanels = [
  {
    id: 'queries',
    Component: Queries
  },
  {
    id: 'flags',
    Component: Flags
  },
  {
    id: 'library versions',
    Component: LibraryVersions
  }
]

const DevToolsNavList = ({ selected, panels, onNav }) => {
  return (
    <List>
      {panels.map(panel => {
        return (
          <ListItem
            key={panel.id}
            selected={selected === panel.id}
            dense
            button
            onClick={() => onNav(panel.id)}
          >
            <ListItemText>{panel.id}</ListItemText>
            <NavSecondaryAction />
          </ListItem>
        )
      })}
    </List>
  )
}

const useResizeStyles = makeStyles(theme => ({
  root: {
    height: 3,
    width: '100%',
    background: theme.palette.primary.main,
    cursor: 'row-resize'
  }
}))

const ResizeBar = ({ ...props }) => {
  const theme = useTheme()
  const classes = useResizeStyles(theme)
  return <div className={classes.root} {...props} />
}

const DevToolsPanel = props => {
  const { panels: userPanels, open, client } = props
  const panels = useMemo(() => {
    if (userPanels) {
      return [...defaultPanels, ...userPanels]
    }
    return defaultPanels
  }, [userPanels])
  const [currentPanel, setCurrentPanel] = useLocalState(
    'cozydevtools__panel',
    'queries'
  )
  const ref = useRef()

  const [panelHeight, setPanelHeight] = useLocalState(
    'cozydevtools__height',
    DEFAULT_PANEL_HEIGHT
  )
  /**
   * Copied/adapted from react-query
   * https://github.com/tannerlinsley/react-query/blob/master/src/devtools/devtools.tsx
   */
  const handleDragStart = startEvent => {
    if (startEvent.button !== 0) return // Only allow left click for drag

    const node = ref.current
    if (node === undefined) {
      return
    }

    const dragInfo = {
      // @ts-ignore
      originalHeight: node.getBoundingClientRect().height,
      pageY: startEvent.pageY
    }

    const run = moveEvent => {
      const delta = dragInfo.pageY - moveEvent.pageY
      const newHeight = dragInfo.originalHeight + delta

      setPanelHeight(newHeight)
    }

    const unsub = () => {
      document.removeEventListener('mousemove', run)
      document.removeEventListener('mouseUp', unsub)
    }

    document.addEventListener('mousemove', run)
    document.addEventListener('mouseup', unsub)
  }

  const classes = useStyles()

  return (
    <Slide direction="up" in={open} mountOnEnter unmountOnExit>
      <Paper
        elevation={12}
        ref={ref}
        className={props.className}
        style={{ height: panelHeight }}
      >
        <ResizeBar onMouseDown={handleDragStart} />
        <IconButton className={classes.closeIcon} onClick={props.onClose}>
          <Icon icon={CrossMedium} size={12} />
        </IconButton>
        <Grid container className={classes.panelContainer}>
          <ListGridItem>
            <Box p={1}>
              <Typography variant="subtitle1">Cozy Devtools</Typography>
            </Box>
            <DevToolsNavList
              panels={panels}
              selected={currentPanel}
              onNav={setCurrentPanel}
            />
          </ListGridItem>
          {panels.map(panelOptions =>
            currentPanel === panelOptions.id ? (
              <panelOptions.Component key={panelOptions.id} client={client} />
            ) : null
          )}
        </Grid>
      </Paper>
    </Slide>
  )
}

const DevTools = ({ panels }) => {
  const classes = useStyles()
  const client = useClient()

  // eslint-disable-next-line no-console
  console.info(' ')
  // eslint-disable-next-line no-console
  console.info('🟢 client :', client)
  // eslint-disable-next-line no-console
  console.info(' ')

  const [open, setOpen] = useLocalState('cozydevtools__open', false)
  const handleToggle = useCallback(() => setOpen(state => !state), [setOpen])

  return (
    <>
      <Fab color="primary" onClick={handleToggle} className={classes.fab}>
        <Icon icon={GearIcon} />
      </Fab>

      <DevToolsPanel
        client={client}
        open={open}
        className={classes.panel}
        onClose={handleToggle}
        panels={panels}
      />
    </>
  )
}

export default DevTools
export { NavSecondaryAction, ListGridItem, useLocalState }
export { default as PanelContent } from './PanelContent'
