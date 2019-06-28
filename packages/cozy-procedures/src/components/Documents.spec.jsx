import { mergeDocsFromStoreAndTemplate } from './Documents'
describe('mergeDocsFromStoreAndTemplate', () => {
  it('should order the documents simple', () => {
    const documentsTemplate = {
      tax_notice: {
        label: 'tax_notice',
        order: 2,
        count: 1,
        rules: {}
      },
      payslip: {
        label: 'payslip',
        order: 1,
        count: 3,
        rules: {}
      }
    }
    const result = mergeDocsFromStoreAndTemplate({}, documentsTemplate)
    expect(Object.keys(result)).toEqual(['payslip', 'tax_notice'])
  })

  it('should order the documents more complex', () => {
    const documentsTemplate = {
      tax_notice: {
        label: 'tax_notice',
        order: 3,
        count: 1,
        rules: {}
      },
      payslip: {
        label: 'payslip',
        order: 1,
        count: 3,
        rules: {}
      },
      payslip1: {
        label: 'payslip',
        order: 2,
        count: 3,
        rules: {}
      }
    }
    const result = mergeDocsFromStoreAndTemplate({}, documentsTemplate)
    expect(Object.keys(result)).toEqual(['payslip', 'payslip1', 'tax_notice'])
  })

  it('sould populated a result based on the template and the store', () => {
    const documentsTemplate = {
      tax_notice: {
        label: 'tax_notice',
        order: 2,
        count: 1,
        rules: {}
      },
      payslip: {
        label: 'payslip',
        order: 1,
        count: 3,
        rules: {}
      }
    }

    const documentsFromStore = {
      tax_notice: {
        files: [
          {
            _id: 1
          }
        ]
      }
    }
    const result = mergeDocsFromStoreAndTemplate(
      documentsFromStore,
      documentsTemplate
    )
    expect(result).toEqual({
      tax_notice: {
        label: 'tax_notice',
        order: 2,
        count: 1,
        rules: {},
        files: [
          {
            _id: 1
          }
        ]
      },
      payslip: {
        label: 'payslip',
        order: 1,
        count: 3,
        rules: {}
      }
    })
  })
})
