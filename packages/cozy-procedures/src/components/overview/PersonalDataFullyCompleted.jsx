import capitalize from 'lodash/capitalize'
import PropTypes from 'prop-types'
import React from 'react'
import snarkdown from 'snarkdown'

import { InlineCard, translate, Text } from 'cozy-ui/transpiled/react'

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
    email,
    fixedCharges
  } = personalData
  return (
    <InlineCard
      className="u-c-pointer u-ph-1 u-pb-half u-pt-1 u-flex u-flex-column"
      onClick={() => navigateTo('personal')}
    >
      <Text
        className="u-mb-half"
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

      <Text
        className="u-mb-half"
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

      <Text
        className="u-mb-half"
        dangerouslySetInnerHTML={{
          __html: snarkdown(
            t('overview.personalDataCompleted.property', {
              propertyStatus: t(
                `personalDataForm.form.propertyStatus.${propertyStatus}`
              ),
              creditsTotalAmount,
              propertyLoan,
              fixedCharges
            })
          )
        }}
      />

      <Text
        className="u-mb-half"
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
