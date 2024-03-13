export const mockPapersDefinitions = [
  {
    label: 'isp_invoice',
    placeholderIndex: 2,
    icon: 'bill',
    featureDate: 'referencedDate',
    maxDisplay: 6,
    acquisitionSteps: [
      {
        model: 'scan',
        multipage: true,
        illustration: 'IlluInvoice.png',
        text: 'PaperJSON.generic.multiPages.text'
      },
      {
        model: 'information',
        illustration: 'IlluGenericDate.svg',
        text: 'PaperJSON.generic.referencedDate.text',
        attributes: [
          {
            name: 'referencedDate',
            type: 'date',
            inputLabel: 'PaperJSON.generic.referencedDate.inputLabel'
          }
        ]
      },
      {
        model: 'owner',
        text: 'PaperJSON.generic.owner.text'
      }
    ],
    konnectorCriteria: {
      category: 'isp'
    }
  },
  {
    label: 'tax_return',
    icon: 'bank',
    featureDate: 'referencedDate',
    maxDisplay: 3,
    acquisitionSteps: [
      {
        model: 'scan',
        multipage: true,
        illustration: 'IlluGenericNewPage.svg',
        text: 'PaperJSON.generic.multiPages.text'
      },
      {
        model: 'information',
        illustration: 'IlluGenericDate.svg',
        text: 'PaperJSON.generic.date.text',
        attributes: [
          {
            name: 'referencedDate',
            type: 'date',
            inputLabel: 'PaperJSON.generic.referencedDate.inputLabel'
          }
        ]
      },
      {
        model: 'owner',
        text: 'PaperJSON.generic.owner.text'
      }
    ],
    konnectorCriteria: {
      name: 'impots'
    }
  },
  {
    label: 'health_certificate',
    placeholderIndex: 1,
    icon: 'heart',
    featureDate: 'issueDate',
    maxDisplay: 4,
    acquisitionSteps: []
  },
  {
    label: 'tax_notice',
    placeholderIndex: 3,
    icon: 'bank',
    featureDate: 'referencedDate',
    maxDisplay: 3,
    acquisitionSteps: [],
    konnectorCriteria: {
      name: 'impots'
    }
  },
  {
    label: 'driver_license',
    country: 'fr',
    icon: 'car',
    featureDate: 'obtentionDate',
    maxDisplay: 2,
    acquisitionSteps: [
      {
        model: 'scan',
        multipage: true,
        illustration: 'IlluGenericNewPage.svg',
        text: 'PaperJSON.generic.multiPages.text'
      },
      {
        model: 'information',
        illustration: 'IlluDriverLicenseNumberHelp.png',
        text: 'PaperJSON.generic.foreign.country.text',
        attributes: [
          {
            name: 'country',
            type: 'text',
            inputLabel: 'PaperJSON.generic.foreign.country.inputLabel'
          }
        ]
      },
      {
        model: 'information',
        illustration: 'IlluDriverLicenseObtentionDateHelp.png',
        text: 'PaperJSON.generic.foreign.obtentionDate.text',
        attributes: [
          {
            name: 'obtentionDate',
            type: 'date',
            inputLabel: 'PaperJSON.generic.foreign.obtentionDate.inputLabel'
          }
        ]
      },
      {
        illustration: 'Account.svg',
        model: 'contact',
        text: 'PaperJSON.generic.owner.text'
      }
    ]
  },
  {
    label: 'driver_license',
    country: 'foreign',
    icon: 'car',
    featureDate: 'obtentionDate',
    maxDisplay: 2,
    acquisitionSteps: [
      {
        model: 'scan',
        multipage: true,
        illustration: 'IlluGenericNewPage.svg',
        text: 'PaperJSON.generic.multiPages.text'
      },
      {
        model: 'information',
        illustration: 'IlluDriverLicenseNumberHelp.png',
        text: 'PaperJSON.generic.foreign.country.text',
        attributes: [
          {
            name: 'country',
            type: 'text',
            inputLabel: 'PaperJSON.generic.foreign.country.inputLabel'
          }
        ]
      },
      {
        model: 'information',
        illustration: 'IlluDriverLicenseObtentionDateHelp.png',
        text: 'PaperJSON.generic.foreign.obtentionDate.text',
        attributes: [
          {
            name: 'obtentionDate',
            type: 'date',
            inputLabel: 'PaperJSON.generic.foreign.obtentionDate.inputLabel'
          }
        ]
      },
      {
        illustration: 'Account.svg',
        model: 'contact',
        text: 'PaperJSON.generic.owner.text'
      }
    ]
  }
]
