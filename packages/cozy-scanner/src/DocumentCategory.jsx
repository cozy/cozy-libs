import classNames from 'classnames'
import PropTypes from 'prop-types'
import React, { Component } from 'react'

import Icon from 'cozy-ui/transpiled/react/Icon'
import IconStack from 'cozy-ui/transpiled/react/IconStack'
import Typography from 'cozy-ui/transpiled/react/Typography'
import ActionMenu, {
  ActionMenuItem,
  ActionMenuHeader
} from 'cozy-ui/transpiled/react/deprecated/ActionMenu'
import GridItem from 'cozy-ui/transpiled/react/deprecated/GridItem'
import { Media, Img, Bd } from 'cozy-ui/transpiled/react/deprecated/Media'
import palette from 'cozy-ui/transpiled/react/palette'

import CategoryGridItem from './CategoryGridItem'
import styles from './stylesheet.css'

/**
 *
 * The goal of this component is to display a
 * category / type of document and also manage
 * its associated ActionMenu since a category has
 * several associated items.
 *
 * If an item from a category is selected, we display
 * its label and the label from the category
 *
 */
class DocumentCategory extends Component {
  state = {
    isMenuDisplayed: false
  }

  openMenu = () => {
    this.setState({ isMenuDisplayed: true })
  }

  closeMenu = () => {
    this.setState({ isMenuDisplayed: false })
  }

  onSelect = item => {
    const { onSelect } = this.props
    if (onSelect) onSelect(item)
  }
  render() {
    const { isMenuDisplayed } = this.state
    const { category, isSelected, selectedItem, scannerT } = this.props
    return (
      <>
        <GridItem onClick={this.openMenu}>
          <CategoryGridItem
            isSelected={isSelected}
            icon={category.icon}
            theme={scannerT(`Scan.themes.${category.label}`)}
            label={
              isSelected
                ? scannerT(`Scan.items.${selectedItem.label}`)
                : undefined
            }
          />
        </GridItem>

        {isMenuDisplayed && (
          <ActionMenu
            onClose={this.closeMenu}
            autoclose
            popperOptions={{ strategy: 'fixed' }}
          >
            <ActionMenuHeader>
              <Media>
                <Img>
                  <IconStack
                    foreground={
                      <Icon
                        icon={category.icon}
                        color={palette.dodgerBlue}
                        size="16"
                        className={classNames(styles['icon-absolute-centered'])}
                      />
                    }
                    background={
                      <Icon
                        icon="file-duotone"
                        size="32"
                        color={palette.dodgerBlue}
                      />
                    }
                  />
                </Img>
                <Bd className="u-ml-1">
                  <Typography tag="span" ellipsis variant="h6">
                    {scannerT(`Scan.themes.${category.label}`)}
                  </Typography>
                </Bd>
              </Media>
            </ActionMenuHeader>
            {category.items.map(item => {
              return (
                <ActionMenuItem
                  onClick={() => {
                    this.onSelect({
                      categoryLabel: category.label,
                      item: item
                    })
                  }}
                  key={item.label}
                >
                  {scannerT(`Scan.items.${item.label}`)}
                </ActionMenuItem>
              )
            })}
          </ActionMenu>
        )}
      </>
    )
  }
}

DocumentCategory.propTypes = {
  onSelect: PropTypes.func,
  category: PropTypes.object.isRequired,
  isSelected: PropTypes.bool,
  selectedItem: PropTypes.object.isRequired,
  scannerT: PropTypes.func.isRequired
}

export default DocumentCategory
