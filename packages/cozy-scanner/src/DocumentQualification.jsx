import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Icon from 'cozy-ui/transpiled/react/Icon'
import { Title } from 'cozy-ui/transpiled/react/Text'
import Label from 'cozy-ui/transpiled/react/Label'
import Input from 'cozy-ui/transpiled/react/Input'
import InputGroup from 'cozy-ui/transpiled/react/InputGroup'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import MuiCozyTheme from 'cozy-ui/transpiled/react/MuiCozyTheme'
import Grid from 'cozy-ui/transpiled/react/MuiCozyTheme/Grid'

import CategoryGridItem from './CategoryGridItem'
import DocumentCategory from './DocumentCategory'

import { themes } from './DocumentTypeData'
import { getItemById, getItemsByCategory } from './DocumentTypeDataHelpers'
import GridItem from 'cozy-ui/transpiled/react/Labs/GridItem'
import styles from './stylesheet.css'

const fileExtension = '.jpg'
const idFileInput = 'filename_input'

/**
 *
 * Used to describe a document ie:
 *  - Selecting a metadata category etc
 *  - Renaming the file
 *
 * When a selection is done,
 * `props.onDescribed` is called with the selected item
 *
 */
export class DocumentQualification extends Component {
  constructor(props) {
    super(props)
    const { categoryLabel = null, itemId = null } = props.initialSelected || {}
    this.defaultFilename = `Scan_${new Date().toISOString().replace(/:/g, '-')}`
    this.state = {
      selected: { categoryLabel, itemId },
      filename: this.defaultFilename,
      hasUserWrittenFileName: false
    }
    this.textInput = React.createRef()
  }

  getFilenameFromCategory = (item, t) => {
    const realItem = getItemById(item.itemId)
    if (realItem) {
      const name = t(`Scan.items.${realItem.label}`)
      return `${name.replace(/ /g, '-')}_${new Date()
        .toISOString()
        .substr(0, 10)}`
    } else {
      return this.defaultFilename
    }
  }

  onSelect = item => {
    const { t, allowEditFileName } = this.props
    const { hasUserWrittenFileName } = this.state
    let filename = null
    if (!hasUserWrittenFileName) {
      filename = this.getFilenameFromCategory(item, t)
    } else {
      filename = this.state.filename
    }
    this.setState({ selected: item })
    this.handleFileNameChange(filename)

    const { onDescribed } = this.props
    if (onDescribed) {
      const realItem = getItemById(item.itemId)
      /* ATM, we only accept JPG extension from the scanner. So
      we hardcode the filename extension here.

      If we can't edit file name, then we don't need to use the
      generated filename
      */
      if (allowEditFileName) {
        onDescribed(realItem ? realItem : undefined, filename + fileExtension)
      } else {
        onDescribed(realItem ? realItem : undefined)
      }
    }
  }
  /**
   * Method used to synchronize our internal state and
   * our parent state if needed
   */
  handleFileNameChange = filename => {
    const { onFileNameChanged } = this.props
    this.setState({ filename })
    onFileNameChanged && onFileNameChanged(filename + fileExtension)
  }

  render() {
    const { t, title, allowEditFileName } = this.props
    const { selected, filename, hasUserWrittenFileName } = this.state
    return (
      <MuiCozyTheme>
        {allowEditFileName && (
          <>
            <Label htmlFor={idFileInput}>{t('Scan.filename')}</Label>
            <InputGroup
              fullwidth
              append={<span className="u-pr-1">{fileExtension}</span>}
              className="u-bdrs-3"
            >
              <Input
                placeholder={t('Scan.filename')}
                value={filename}
                onChange={event => {
                  // console.log('event', event)
                  // If the user write something once, we don't want to rename the file automatically anymore
                  if (!hasUserWrittenFileName) {
                    this.setState({ hasUserWrittenFileName: true })
                  }
                  // If we left an empty value, then we reset the behavior
                  if (event.target.value === '') {
                    this.setState({ hasUserWrittenFileName: false })
                  }

                  this.handleFileNameChange(event.target.value)
                }}
                onFocus={() => {
                  if (!hasUserWrittenFileName)
                    this.textInput.current.setSelectionRange(0, filename.length)
                }}
                onBlur={() => {
                  if (filename === '') {
                    this.handleFileNameChange(
                      this.getFilenameFromCategory(selected, t)
                    )
                  }
                }}
                inputRef={this.textInput}
                id={idFileInput}
              />
            </InputGroup>
          </>
        )}

        {title && (
          <div className="u-flex u-flex-items-center u-mt-1-half">
            <Icon icon="qualify" />
            <Title
              className={classNames(
                styles['grid-item-title'],
                'u-pl-half u-mb-1'
              )}
            >
              {title}
            </Title>
          </div>
        )}
        <Grid container spacing={8}>
          <GridItem
            onClick={() => this.onSelect({ categoryLabel: null, itemId: null })}
          >
            <CategoryGridItem
              isSelected={selected.categoryLabel === null}
              theme={t(`Scan.themes.undefined`)}
            />
          </GridItem>

          {themes.map((category, i) => {
            return (
              <DocumentCategory
                onSelect={item => this.onSelect(item)}
                category={category}
                items={getItemsByCategory(category)}
                key={i}
                isSelected={selected.categoryLabel === category.label}
                selectedItem={
                  selected.itemId ? getItemById(selected.itemId) : {}
                }
                t={t}
              />
            )
          })}
        </Grid>
      </MuiCozyTheme>
    )
  }
}

DocumentQualification.defaultProps = {
  allowEditFileName: false
}
DocumentQualification.propTypes = {
  /** This callback is called after a qualification with
   * the selected item
   */
  onDescribed: PropTypes.func,
  onFileNameChanged: PropTypes.func,
  title: PropTypes.string,
  initialSelected: PropTypes.shape({
    itemId: PropTypes.string,
    categoryLabel: PropTypes.string
  }),
  /** define is the user can edit the filename */
  allowEditFileName: PropTypes.bool
}
export default translate()(DocumentQualification)
