import React from 'react'
import PropTypes from 'prop-types'
import { Account } from 'cozy-doctypes'
import SelectBox, {
  reactSelectControl
} from 'cozy-ui/transpiled/react/SelectBox'

import MenuWithFixedComponent from './MenuWithFixedComponent'
import AccountSelectControl from './AccountSelectControl'

const AccountSelectBox = ({
  accountList,
  selectedAccount,
  onChange,
  onCreate
}) => {
  return (
    <SelectBox
      size="tiny"
      options={accountList}
      onChange={onChange}
      createAction={onCreate}
      getOptionLabel={option => Account.getAccountName(option.account)}
      getOptionValue={option => option.trigger._id}
      defaultValue={accountList[0]}
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
  accountList: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedAccount: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired
}

export default AccountSelectBox
