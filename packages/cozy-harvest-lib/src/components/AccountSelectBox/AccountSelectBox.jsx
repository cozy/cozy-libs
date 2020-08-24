import React from 'react'
import PropTypes from 'prop-types'
import { Account } from 'cozy-doctypes'
import SelectBox, {
  reactSelectControl
} from 'cozy-ui/transpiled/react/SelectBox'

import MenuWithFixedComponent from './MenuWithFixedComponent'
import AccountSelectControl from './AccountSelectControl'

const AccountSelectBox = ({
  accountsList,
  selectedAccount,
  onChange,
  onCreate,
  loading
}) => {
  if (loading) {
    return <div style={{ height: 20.8 }}>&nbsp;</div>
  }
  return (
    <SelectBox
      size="tiny"
      options={accountsList}
      onChange={onChange}
      createAction={onCreate}
      getOptionLabel={option => Account.getAccountName(option.account)}
      getOptionValue={option => option.trigger._id}
      isSearchable={false}
      defaultValue={
        selectedAccount
          ? accountsList.find(
              ({ account }) => account._id === selectedAccount._id
            )
          : accountsList[0]
      }
      components={{
        Control: reactSelectControl(
          <AccountSelectControl
            name={Account.getAccountName(selectedAccount)}
          />
        ),
        Menu: MenuWithFixedComponent
      }}
    />
  )
}

AccountSelectBox.propTypes = {
  accountsList: PropTypes.arrayOf(PropTypes.object).isRequired,
  /** @type {io.cozy.accounts} The account currently shown, can be null if loading is true */
  selectedAccount: PropTypes.object,
  /** @type {Boolean} If true, renders an empty div with the same height as the SelectBox */
  loading: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired
}

export default AccountSelectBox
