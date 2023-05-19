import PropTypes from 'prop-types'
import React from 'react'

import { Account } from 'cozy-doctypes'
import SelectBox, {
  reactSelectControl
} from 'cozy-ui/transpiled/react/SelectBox'

import AccountSelectControl from './AccountSelectControl'
import MenuWithFixedComponent from './MenuWithFixedComponent'

const AccountSelectBox = ({
  accountsAndTriggers,
  selectedAccount,
  onChange,
  onCreate,
  loading,
  variant
}) => {
  if (loading) {
    return <div style={{ height: 20.8 }}>&nbsp;</div>
  }
  return (
    <SelectBox
      menuPosition="fixed"
      size="tiny"
      options={accountsAndTriggers}
      onChange={onChange}
      createAction={onCreate}
      getOptionLabel={option => Account.getAccountName(option.account)}
      getOptionValue={option => option.trigger._id}
      isSearchable={false}
      defaultValue={
        selectedAccount
          ? accountsAndTriggers.find(
              ({ account }) => account._id === selectedAccount._id
            )
          : accountsAndTriggers[0]
      }
      components={{
        Control: reactSelectControl(
          <AccountSelectControl
            name={Account.getAccountName(selectedAccount)}
            variant={variant}
          />
        ),
        Menu: MenuWithFixedComponent
      }}
    />
  )
}

AccountSelectBox.propTypes = {
  accountsAndTriggers: PropTypes.arrayOf(PropTypes.object).isRequired,
  /** @type {io.cozy.accounts} The account currently shown, can be null if loading is true */
  selectedAccount: PropTypes.object,
  /** @type {Boolean} If true, renders an empty div with the same height as the SelectBox */
  loading: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired
}

export default AccountSelectBox
