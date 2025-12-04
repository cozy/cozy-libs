import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { useI18n, useExtendI18n } from 'twake-i18n'

import Button from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'
import PersonAddIcon from 'cozy-ui/transpiled/react/Icons/PersonAdd'
import { useBreakpoints } from 'cozy-ui/transpiled/react/providers/Breakpoints'

import GroupsSelection from './GroupsSelection'
import ImportDropdown from './ImportDropdown'
import SearchInput from './SearchInput'
import { locales } from './locales'

const Header = ({
  allGroups,
  onContactCreate,
  onContactImport,
  onSearch,
  onGroupCreate,
  onGroupDelete,
  onGroupUpdate
}) => {
  useExtendI18n(locales)
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()

  return (
    <div className={!isMobile ? 'u-flex u-flex-justify-between' : undefined}>
      <div
        className={cx('u-flex u-flex-items-center u-w-auto-s u-w-5 u-maw-6', {
          'u-mb-1': isMobile,
          'u-mr-1': !isMobile
        })}
      >
        <Button
          className="u-mr-half"
          variant="ghost"
          startIcon={<Icon icon={PersonAddIcon} />}
          label={t('Contacts.Header.create')}
          fullWidth
          onClick={onContactCreate}
        />
        <ImportDropdown onContactImport={onContactImport} />
      </div>
      <div
        className={
          !isMobile
            ? 'u-flex u-flex-items-center u-flex-justify-end u-flex-grow-1 u-maw-7'
            : undefined
        }
      >
        <GroupsSelection
          allGroups={allGroups}
          onGroupCreate={onGroupCreate}
          onGroupUpdate={onGroupUpdate}
          onGroupDelete={onGroupDelete}
        />
        <SearchInput setSearchValue={onSearch} />
      </div>
    </div>
  )
}

Header.propTypes = {
  allGroups: PropTypes.array,
  onContactCreate: PropTypes.func,
  onContactImport: PropTypes.func,
  onSearch: PropTypes.func,
  onGroupCreate: PropTypes.func,
  onGroupUpdate: PropTypes.func,
  onGroupDelete: PropTypes.func
}

Header.defaultProps = {
  allGroups: []
}

export default Header
