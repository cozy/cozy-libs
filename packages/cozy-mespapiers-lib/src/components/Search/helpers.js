import { themesList } from 'cozy-client/dist/models/document/documentTypeData'

import { index, addDoc, updateDoc } from './search'

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

export const makeFirstSearchResultMatchingAttributes = (results, id) =>
  results.map(x => (x.result.includes(id) ? x.field : undefined)).filter(x => x)

export const search = ({ docs, value, tag }) => {
  const results = index.search(value, { tag })
  const resultIds = makeReducedResultIds(results)

  const filteredDocs =
    resultIds
      ?.map(resultId => docs.find(doc => doc._id === resultId))
      .filter(x => x !== undefined) || []

  const firstSearchResultMatchingAttributes =
    makeFirstSearchResultMatchingAttributes(results, resultIds[0])

  return { filteredDocs, firstSearchResultMatchingAttributes }
}

const onCreate = t => async doc => {
  addDoc({ index, doc, t })
}

const onUpdate = t => async doc => {
  updateDoc({ index, doc, t })
}

export const makeRealtimeConnection = (doctypes, t) =>
  doctypes.reduce(
    (acc, curr) => ({
      ...acc,
      [`${curr}`]: {
        created: onCreate(t),
        updated: onUpdate(t)
      }
    }),
    {}
  )

export const makeFileTags = file => {
  const item = file.metadata?.qualification
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
  translatedQualificationLabel: scannerT(
    `items.${doc.metadata.qualification.label}`
  ),
  ...(doc.metadata.refTaxIncome && {
    translatedRefTaxIncome: t('Search.metadataLabel.refTaxIncome')
  }),
  ...(doc.metadata.contractType && {
    translatedContractType: t('Search.metadataLabel.contractType')
  }),
  ...(doc.metadata.qualification?.label === 'driver_license' && {
    translatedDriverLicense: t('Search.metadataLabel.driver_license')
  }),
  ...(doc.metadata.qualification?.label ===
    'payment_proof_family_allowance' && {
    translatedPaymentProofFamilyAllowance: t(
      'Search.metadataLabel.payment_proof_family_allowance'
    )
  }),
  ...(doc.metadata.qualification?.label === 'vehicle_registration' && {
    translatedVehicleRegistration: t(
      'Search.metadataLabel.vehicle_registration'
    )
  }),
  ...(doc.metadata.qualification?.label === 'national_id_card' && {
    translatedNationalIdCard: t('Search.metadataLabel.national_id_card')
  }),
  ...(doc.metadata.qualification?.label === 'bank_details' && {
    translatedBankDetails: t('Search.metadataLabel.bank_details')
  }),
  ...(doc.metadata.qualification?.label === 'passport' && {
    translatedPassport: t('Search.metadataLabel.passport')
  })
})

export const makeContactFlexsearchProps = doc => {
  const flexsearchEmailAddresses = doc.email
    ?.map(email => email.address)
    .reduce((acc, val, idx) => ({ ...acc, [`email[${idx}].address`]: val }), {})

  const flexsearchPhoneNumbers = doc.phone
    ?.map(phone => phone.number)
    .reduce((acc, val, idx) => ({ ...acc, [`phone[${idx}].number`]: val }), {})

  return {
    tag: makeContactTags(doc),
    ...flexsearchEmailAddresses,
    ...flexsearchPhoneNumbers
  }
}
