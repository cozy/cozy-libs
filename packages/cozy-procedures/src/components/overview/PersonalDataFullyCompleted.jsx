import React from 'react'
import PropTypes from 'prop-types'
import { InlineCard, translate } from 'cozy-ui/transpiled/react'

const capitalize = str =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()

const PersonalDataFullyCompleted = ({ navigateTo, personalData, t }) => {
  console.log({ personalData })

  const {
    firstname,
    lastname,
    maritalStatus,
    numberOfDependants,
    employmentStatus,
    employmentContract,
    salary,
    additionalIncome,
    propertyStatus,
    creditsTotalAmount,
    propertyLoan,
    address,
    phone,
    email
  } = personalData
  return (
    <InlineCard
      className="u-c-pointer u-p-1 u-flex u-flex-column"
      onClick={() => navigateTo('personal')}
    >
      <p>
        {t('overview.personalDataCompleted.I', {
          firstname: capitalize(firstname),
          lastname: capitalize(lastname),
          maritalStatus: t(
            `personalDataForm.form.maritalStatus.${maritalStatus}`
          ),
          numberOfDependants
        })}
      </p>
      <p>
        {t('overview.personalDataCompleted.work', {
          employmentStatus: t(
            `personalDataForm.form.employmentStatus.${employmentStatus}`
          ),
          employmentContract: t(
            `personalDataForm.form.employmentContract.${employmentContract}`
          ),
          salary,
          additionalIncome
        })}
      </p>
      <p>
        {t('overview.personalDataCompleted.property', {
          propertyStatus: t(
            `personalDataForm.form.propertyStatus.${propertyStatus}`
          ),
          creditsTotalAmount,
          propertyLoan
        })}
      </p>
      <p>
        {t('overview.personalDataCompleted.address', {
          address,
          phone,
          email
        })}
      </p>
    </InlineCard>
  )
}

export default translate()(PersonalDataFullyCompleted)
