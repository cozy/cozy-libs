import React from 'react'
import PropTypes from 'prop-types'
import snarkdown from 'snarkdown'
import capitalize from 'lodash/capitalize'
import { InlineCard, translate } from 'cozy-ui/transpiled/react'

const PersonalDataFullyCompleted = ({ navigateTo, personalData, t }) => {
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
      <p
        dangerouslySetInnerHTML={{
          __html: snarkdown(
            t('overview.personalDataCompleted.I', {
              firstname: capitalize(firstname),
              lastname: capitalize(lastname),
              maritalStatus: t(
                `personalDataForm.form.maritalStatus.${maritalStatus}`
              ),
              numberOfDependants
            })
          )
        }}
      />

      <p
        dangerouslySetInnerHTML={{
          __html: snarkdown(
            t('overview.personalDataCompleted.work', {
              employmentStatus: t(
                `personalDataForm.form.employmentStatus.${employmentStatus}`
              ),
              employmentContract: t(
                `personalDataForm.form.employmentContract.${employmentContract}`
              ),
              salary,
              additionalIncome
            })
          )
        }}
      />

      <p
        dangerouslySetInnerHTML={{
          __html: snarkdown(
            t('overview.personalDataCompleted.property', {
              propertyStatus: t(
                `personalDataForm.form.propertyStatus.${propertyStatus}`
              ),
              creditsTotalAmount,
              propertyLoan
            })
          )
        }}
      />

      <p
        dangerouslySetInnerHTML={{
          __html: snarkdown(
            t('overview.personalDataCompleted.address', {
              address,
              phone,
              email
            })
          )
        }}
      />
    </InlineCard>
  )
}
PersonalDataFullyCompleted.propTypes = {
  navigateTo: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  personalData: PropTypes.object.isRequired
}
export default translate()(PersonalDataFullyCompleted)
