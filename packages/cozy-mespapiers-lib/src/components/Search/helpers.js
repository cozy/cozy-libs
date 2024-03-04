import intersection from 'lodash/intersection'

import { index, addDoc, updateDoc } from './search'
import { getThemesList } from '../../helpers/themes'

export const addAllOnce =
  ({ isAdded, setIsAdded, scannerT, t }) =>
  docs => {
    if (!isAdded) {
      for (const doc of docs) {
        addDoc({ index, doc, scannerT, t })
      }
      setIsAdded(true)
    }
  }

export const makeReducedResultIds = flexsearchResult =>
  flexsearchResult?.reduce((acc, curr) => {
    curr?.result?.forEach(id => {
      const isAlreadyReturned = acc.findIndex(el => el === id) !== -1
      if (!isAlreadyReturned) {
        acc.push(id)
      }
    })
    return acc
  }, [])

const makeFirstSearchResultMatchingAttributes = (results, id) =>
  results.map(x => (x.result.includes(id) ? x.field : undefined)).filter(x => x)

export const search = async ({ docs, value, tag }) => {
  const tokens = value?.trim().split(' ')
  const isMultipleSearch = tokens?.length > 1

  return isMultipleSearch
    ? await computeResultForMultipleSearch({ docs, tokens, tag })
    : computeResultForSearch({ docs, token: tokens[0], tag })
}

export const makeMultipleSearchResultIds = resultsPerTokens => {
  const resultsIdsPerTokens = resultsPerTokens.map(resultsPerToken =>
    makeReducedResultIds(resultsPerToken)
  )

  return intersection(...resultsIdsPerTokens)
}

const computeResultForMultipleSearch = async ({ docs, tokens, tag }) => {
  const promises = tokens.map(token =>
    index.searchAsync(token, { tag, limit: 9999 })
  )
  const resultsPerTokens = await Promise.all(promises)

  const resultIds = makeMultipleSearchResultIds(resultsPerTokens)

  const filteredDocs =
    resultIds
      ?.map(resultId => docs.find(doc => doc._id === resultId))
      .filter(x => x !== undefined) || []

  const firstSearchResultMatchingAttributes =
    makeFirstSearchResultMatchingAttributes(resultsPerTokens[0], resultIds[0])

  return { filteredDocs, firstSearchResultMatchingAttributes }
}

const computeResultForSearch = ({ docs, token, tag }) => {
  const results = index.search(token, { tag, limit: 9999 })

  const resultIds = makeReducedResultIds(results)

  const filteredDocs =
    resultIds
      ?.map(resultId => docs.find(doc => doc._id === resultId))
      .filter(x => x !== undefined) || []

  const firstSearchResultMatchingAttributes =
    makeFirstSearchResultMatchingAttributes(results, resultIds[0])

  return { filteredDocs, firstSearchResultMatchingAttributes }
}

const onCreate = (scannerT, t) => async doc => {
  addDoc({ index, doc, scannerT, t })
}

const onUpdate = (scannerT, t) => async doc => {
  updateDoc({ index, doc, scannerT, t })
}

export const makeRealtimeConnection = (doctypes, scannerT, t) =>
  doctypes.reduce(
    (acc, curr) => ({
      ...acc,
      [`${curr}`]: {
        created: onCreate(scannerT, t),
        updated: onUpdate(scannerT, t)
      }
    }),
    {}
  )

export const makeFileTags = file => {
  const item = file.metadata?.qualification
  const themesList = getThemesList()
  const tags = themesList
    .filter(theme => {
      return theme.items.some(it => it.label === item?.label)
    })
    .map(x => x.label)
  return tags
}

export const makeContactTags = contact => {
  const contactTags = []

  const themesByAttributes = {
    givenName: ['identity'],
    familyName: ['identity'],
    phone: ['home', 'work_study', 'identity'],
    email: ['work_study', 'identity'],
    cozy: ['identity'],
    address: ['home', 'work_study', 'identity'],
    birthday: ['identity'],
    company: ['work_study'],
    jobTitle: ['work_study']
  }

  Object.keys(themesByAttributes).map(attribute => {
    const preAttribute = ['givenName', 'familyName'].includes(attribute)
      ? 'name'
      : undefined

    const value = preAttribute
      ? contact?.[preAttribute]?.[attribute]
      : contact?.[attribute]

    const themes = themesByAttributes[attribute]

    if (value && value.length > 0) {
      themes.forEach(theme => {
        if (!contactTags.includes(theme)) {
          contactTags.push(theme)
        }
      })
    }
  })

  return contactTags
}

export const makeFileFlexsearchProps = ({ doc, scannerT, t }) => ({
  tag: makeFileTags(doc),
  translated: {
    qualificationLabel: scannerT(`items.${doc.metadata.qualification.label}`),
    ...(doc.metadata.refTaxIncome && {
      'metadata.refTaxIncome': t('Search.attributeLabel.metadata.refTaxIncome')
    }),
    ...(doc.metadata.netSocialAmount && {
      'metadata.netSocialAmount': t(
        'Search.attributeLabel.metadata.netSocialAmount'
      )
    }),
    ...(doc.metadata.contractType && {
      'metadata.contractType': t('Search.attributeLabel.metadata.contractType')
    }),
    ...(doc.metadata.expirationDate && {
      'metadata.expirationDate': t(
        'Search.attributeLabel.metadata.expirationDate'
      )
    }),
    ...(doc.metadata.qualification?.label === 'driver_license' && {
      driverLicense: t('Search.attributeLabel.metadata.driver_license')
    }),
    ...(doc.metadata.qualification?.label ===
      'payment_proof_family_allowance' && {
      paymentProofFamilyAllowance: t(
        'Search.attributeLabel.metadata.payment_proof_family_allowance'
      )
    }),
    ...(doc.metadata.qualification?.label === 'caf' && {
      caf: t('Search.attributeLabel.metadata.caf')
    }),
    ...(doc.metadata.qualification?.label === 'vehicle_registration' && {
      vehicleRegistration: t(
        'Search.attributeLabel.metadata.vehicle_registration'
      )
    }),
    ...(doc.metadata.qualification?.label === 'national_id_card' && {
      nationalIdCard: t('Search.attributeLabel.metadata.national_id_card')
    }),
    ...(doc.metadata.qualification?.label === 'bank_details' && {
      bankDetails: t('Search.attributeLabel.metadata.bank_details')
    }),
    ...(doc.metadata.qualification?.label === 'passport' && {
      passport: t('Search.attributeLabel.metadata.passport')
    }),
    ...(doc.metadata.qualification?.label === 'residence_permit' && {
      residencePermit: t('Search.attributeLabel.metadata.residence_permit')
    })
  }
})

/**
 * @param {object} doc - A contact
 * @param {object} t - The translation function
 * @returns {object} - The flexsearch props for a contact
 */
export const makeContactFlexsearchProps = (doc, t) => {
  // TODO On the connector side, the `email` field of the `Contact` object could be a string instead of an object array. Issue fixed here: https://github.com/konnectors/libs/pull/987. Pending the propagation of the fix, it is relevant to predict the case here
  const normalizeEmail =
    typeof doc.email === 'string' ? [{ address: doc.email }] : doc.email
  const flexsearchEmailAddresses = normalizeEmail
    ?.map(email => email.address)
    .reduce((acc, val, idx) => ({ ...acc, [`email[${idx}].address`]: val }), {})

  const flexsearchPhoneNumbers = doc.phone
    ?.map(phone => phone.number)
    .reduce((acc, val, idx) => ({ ...acc, [`phone[${idx}].number`]: val }), {})

  const flexsearchPostalAddresses = doc.address
    ?.map(address => address.formattedAddress)
    .reduce(
      (acc, val, idx) => ({
        ...acc,
        [`address[${idx}].formattedAddress`]: val
      }),
      {}
    )

  return {
    tag: makeContactTags(doc),
    translated: {
      ...(doc.phone?.length > 0 && {
        phone: t('Search.attributeLabel.phone')
      }),
      ...(doc.email?.length > 0 && {
        email: t('Search.attributeLabel.email')
      }),
      ...(doc.birthday && {
        birthday: t('Search.attributeLabel.birthday')
      }),
      ...(doc.address?.length > 0 && {
        address: t('Search.attributeLabel.address')
      })
    },
    ...flexsearchEmailAddresses,
    ...flexsearchPhoneNumbers,
    ...flexsearchPostalAddresses
  }
}
