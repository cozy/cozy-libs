import { buildPapersDefinitions } from './buildPapersDefinitions'

describe('buildPapersDefinitions', () => {
  const scannerT = jest.fn(key => {
    switch (key) {
      case 'items.one':
        return 'a'
      case 'items.two':
        return 'b'
      case 'items.other_three':
        return 'c'
      case 'items.note_identity_document':
        return 'd'
      case 'items.four':
        return 'e'
    }
  })
  const mockPapersDef = [
    {
      label: 'two',
      acquisitionSteps: [],
      konnectorCriteria: {
        name: 'myKonnector'
      }
    },
    {
      label: 'other_three',
      acquisitionSteps: [
        {
          stepIndex: 1
        }
      ],
      konnectorCriteria: {
        name: 'myKonnector'
      }
    },
    {
      label: 'note_identity_document',
      acquisitionSteps: [
        {
          stepIndex: 1
        }
      ]
    },
    {
      label: 'four',
      acquisitionSteps: []
    },
    {
      label: 'one',
      acquisitionSteps: [
        {
          stepIndex: 1
        }
      ],
      konnectorCriteria: {
        name: 'myKonnector'
      }
    }
  ]

  const expectedPapersDef = [
    {
      label: 'one',
      acquisitionSteps: [
        {
          stepIndex: 1
        }
      ],
      konnectorCriteria: {
        name: 'myKonnector'
      }
    },
    {
      label: 'two',
      acquisitionSteps: [],
      konnectorCriteria: {
        name: 'myKonnector'
      }
    },
    {
      label: 'other_three',
      acquisitionSteps: [
        {
          stepIndex: 1
        }
      ],
      konnectorCriteria: {
        name: 'myKonnector'
      }
    },
    {
      label: 'note_identity_document',
      acquisitionSteps: [
        {
          stepIndex: 1
        }
      ]
    },
    {
      label: 'four',
      acquisitionSteps: []
    }
  ]

  it('should correctly sort papersDef', () => {
    const res = buildPapersDefinitions(mockPapersDef, scannerT)

    expect(res).toEqual(expectedPapersDef)
  })
})
