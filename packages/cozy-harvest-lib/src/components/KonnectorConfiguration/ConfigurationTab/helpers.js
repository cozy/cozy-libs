import set from 'lodash/set'
import { setFields as setBankAccountFields } from './bankAccountHelpers'

const setFieldsPerDoctype = {
  'io.cozy.bank.accounts': setBankAccountFields,
  default: set
}

export const updateContract = async (client, contract, options) => {
  const { fields, onSuccess, onError } = options

  const setFields =
    setFieldsPerDoctype[contract._type] || setFieldsPerDoctype.default
  setFields(contract, fields)

  try {
    await client.save(contract)
    onSuccess()
  } catch (err) {
    onError(err)
  }
}
