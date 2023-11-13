import React from 'react'

import List from 'cozy-ui/transpiled/react/List'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Radio from 'cozy-ui/transpiled/react/Radios'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const PageEditItems = ({ items, onChange, value }) => {
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()

  return (
    <List className="u-pv-0">
      {items.map((item, idx) => (
        <ListItem
          key={idx}
          {...(!isMobile && { disableGutters: true })}
          button
          onClick={() => onChange(item)}
        >
          <ListItemIcon>
            <Radio
              checked={value === item}
              onChange={() => onChange(item)}
              value={item}
              name="radio-page-attribute"
            />
          </ListItemIcon>
          <ListItemText primary={t(`PageEdit.${item}`)} />
        </ListItem>
      ))}
    </List>
  )
}

export default PageEditItems
