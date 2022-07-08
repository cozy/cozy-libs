export const mockPapersDefinitions = [
  {
    label: 'isp_invoice',
    placeholderIndex: 2,
    icon: 'bill',
    featureDate: 'referencedDate',
    maxDisplay: 6,
    acquisitionSteps: [
      {
        stepIndex: 1,
        model: 'scan',
        multipage: true,
        illustration: 'IlluInvoice.png',
        text: 'PaperJSON.generic.multiPages.text'
      },
      {
        stepIndex: 2,
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
        stepIndex: 3,
        model: 'owner',
        text: 'PaperJSON.generic.owner.text'
      }
    ],
    connectorCriteria: {
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
        stepIndex: 1,
        model: 'scan',
        multipage: true,
        illustration: 'IlluGenericNewPage.svg',
        text: 'PaperJSON.generic.multiPages.text'
      },
      {
        stepIndex: 2,
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
        stepIndex: 3,
        model: 'owner',
        text: 'PaperJSON.generic.owner.text'
      }
    ],
    connectorCriteria: {
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
    connectorCriteria: {
      name: 'impots'
    }
  }
]
