import classNames from 'classnames'
import PropTypes from 'prop-types'
import React, { Component } from 'react'

import flag from 'cozy-flags'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import Icon from 'cozy-ui/transpiled/react/Icon'
import QualifyIcon from 'cozy-ui/transpiled/react/Icons/Qualify'
import Input from 'cozy-ui/transpiled/react/Input'
import InputGroup from 'cozy-ui/transpiled/react/InputGroup'
import Label from 'cozy-ui/transpiled/react/Label'
import GridItem from 'cozy-ui/transpiled/react/Labs/GridItem'
import MuiCozyTheme from 'cozy-ui/transpiled/react/MuiCozyTheme'
import Grid from 'cozy-ui/transpiled/react/MuiCozyTheme/Grid'
import Typography from 'cozy-ui/transpiled/react/Typography'

import CategoryGridItem from './CategoryGridItem'
import DocumentCategory from './DocumentCategory'
import { themes } from './DocumentTypeData'
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
    const { categoryLabel = null, item = null } = props.initialSelected || {}
    this.defaultFilename = `Scan_${new Date().toISOString().replace(/:/g, '-')}`
    this.state = {
      selected: { categoryLabel, item },
      filename: this.defaultFilename,
      hasUserWrittenFileName: false,
      overridedThemes: null
    }
    this.textInput = React.createRef()
  }

  UNSAFE_componentWillMount() {
    const overridedThemes = flag('hide.healthTheme.enabled')
      ? themes.filter(theme => theme.label !== 'health')
      : themes
    this.setState({ overridedThemes })
  }

  getFilenameFromCategory = (item, t) => {
    if (item) {
      const name = t(`Scan.items.${item.label}`)
      return `${name.replace(/ /g, '-')}_${new Date()
        .toISOString()
        .substr(0, 10)}`
    } else {
      return this.defaultFilename
    }
  }

  onSelect = selected => {
    const { t, allowEditFileName } = this.props
    const { hasUserWrittenFileName } = this.state
    let filename = null
    if (!hasUserWrittenFileName) {
      filename = this.getFilenameFromCategory(selected.item, t)
    } else {
      filename = this.state.filename
    }
    this.setState({ selected })
    this.handleFileNameChange(filename)

    const { onDescribed } = this.props
    if (onDescribed) {
      /* ATM, we only accept JPG extension from the scanner. So
      we hardcode the filename extension here.

      If we can't edit file name, then we don't need to use the
      generated filename
      */
      const item = selected.item ? selected.item : undefined
      if (allowEditFileName) {
        onDescribed(item, filename + fileExtension)
      } else {
        onDescribed(item)
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
    const { selected, filename, hasUserWrittenFileName, overridedThemes } =
      this.state

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
                      this.getFilenameFromCategory(selected.item, t)
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
            <Icon icon={QualifyIcon} />
            <Typography
              className={classNames(
                styles['grid-item-title'],
                'u-pl-half u-mb-1'
              )}
              variant="h4"
            >
              {title}
            </Typography>
          </div>
        )}
        <Grid container spacing={1}>
          <GridItem
            onClick={() => this.onSelect({ categoryLabel: null, item: null })}
          >
            <CategoryGridItem
              isSelected={selected.categoryLabel === null}
              theme={t(`Scan.themes.undefined`)}
            />
          </GridItem>

          {overridedThemes?.map((category, i) => {
            return (
              <DocumentCategory
                onSelect={selected => this.onSelect(selected)}
                category={category}
                key={i}
                isSelected={selected.categoryLabel === category.label}
                selectedItem={selected.item || {}}
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
    item: PropTypes.object,
    categoryLabel: PropTypes.string
  }),
  /** define is the user can edit the filename */
  allowEditFileName: PropTypes.bool
}
export default translate()(DocumentQualification)
