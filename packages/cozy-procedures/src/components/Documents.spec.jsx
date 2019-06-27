import { mergeDocsFromStoreAndTemplate } from './Documents'
describe('mergeDocsFromStoreAndTemplate', () => {
  it('should order the documents', () => {
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
        documents: 'file1'
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
        documents: 'file1'
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
