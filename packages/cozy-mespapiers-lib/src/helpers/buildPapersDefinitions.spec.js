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
      case 'items.four':
        return 'd'
    }
  })
  const mockPapersDef = [
    {
      label: 'two',
      acquisitionSteps: [],
      konnectorCriteria: {
        name: 'myConnector'
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
        name: 'myConnector'
      }
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
        name: 'myConnector'
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
        name: 'myConnector'
      }
    },
    {
      label: 'two',
      acquisitionSteps: [],
      konnectorCriteria: {
        name: 'myConnector'
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
        name: 'myConnector'
      }
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
