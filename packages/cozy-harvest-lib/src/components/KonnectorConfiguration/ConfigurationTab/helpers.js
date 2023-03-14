import set from 'lodash/set'

import {
  setFields as setBankAccountFields,
  getAccountLabel
} from './bankAccountHelpers'

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

const getPrimaryTextPerDoctype = {
  'io.cozy.bank.accounts': getAccountLabel
}

const getPrimaryTextDefault = contract => contract.label

export const getPrimaryText = contract => {
  const fn = getPrimaryTextPerDoctype[contract._type] || getPrimaryTextDefault
  return fn(contract)
}

export const isDisabled = contract => Boolean(contract?.metadata?.disabledAt)

export const isDeleted = contract => contract._deleted

export const isErrored = contract => Boolean(contract?.metadata?.error)

export const isImported = contract => Boolean(contract?.metadata?.imported)
