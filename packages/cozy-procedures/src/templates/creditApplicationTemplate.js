const schema = {
  type: 'object',
  properties: {
    lastname: {
      title: 'personalDataForm.form.lastname.title',
      type: 'string'
    },
    firstname: {
      title: 'personalDataForm.form.firstname.title',
      type: 'string'
    },
    maritalStatus: {
      title: 'personalDataForm.form.maritalStatus.title',
      type: 'string',
      enum: ['single', 'married', 'separated', 'widowed', 'pacs'],
      enumNames: [
        'personalDataForm.form.maritalStatus.single',
        'personalDataForm.form.maritalStatus.married',
        'personalDataForm.form.maritalStatus.separated',
        'personalDataForm.form.maritalStatus.widowed',
        'personalDataForm.form.maritalStatus.pacs'
      ]
    },
    numberOfDependants: {
      title: 'personalDataForm.form.numberOfDependents.title',
      type: 'integer',
      minimum: 0
    },
    employmentStatus: {
      title: 'personalDataForm.form.employmentStatus.title',
      type: 'string',
      enum: ['employee', 'freelance', 'unemployed', 'retired'],
      enumNames: [
        'personalDataForm.form.employmentStatus.employee',
        'personalDataForm.form.employmentStatus.freelance',
        'personalDataForm.form.employmentStatus.unemployed',
        'personalDataForm.form.employmentStatus.retired'
      ]
    },
    employmentContract: {
      title: 'personalDataForm.form.employmentContract.title',
      type: 'string',
      enum: ['cdd', 'cdi'],
      enumNames: [
        'personalDataForm.form.employmentContract.cdd',
        'personalDataForm.form.employmentContract.cdi'
      ]
    },
    salary: {
      title: 'personalDataForm.form.salary.title',
      type: 'number'
    },
    additionalIncome: {
      title: 'personalDataForm.form.additionalIncome.title',
      type: 'number'
    },
    propertyStatus: {
      title: 'personalDataForm.form.propertyStatus.title',
      type: 'string',
      enum: ['owner', 'tenant', 'housed', 'homeless'],
      enumNames: [
        'personalDataForm.form.propertyStatus.owner',
        'personalDataForm.form.propertyStatus.tenant',
        'personalDataForm.form.propertyStatus.housed',
        'personalDataForm.form.propertyStatus.homeless'
      ]
    },
    propertyLoan: {
      title: 'personalDataForm.form.propertyLoan.title',
      type: 'number'
    },
    creditsTotalAmount: {
      title: 'personalDataForm.form.creditsTotalAmount.title',
      type: 'number'
    },
    address: {
      title: 'personalDataForm.form.address.title',
      type: 'string'
    },
    phone: {
      title: 'personalDataForm.form.phone.title',
      type: 'string'
    },
    email: {
      title: 'personalDataForm.form.email.title',
      type: 'string'
    }
  }
}

const uiSchema = {
  'ui:placeholder': 'procedures.define',
  address: {
    'ui:widget': 'textarea',
    'ui:options': {
      rows: 5
    }
  },
  salary: {
    'ui:widget': 'InputWithUnit',
    'ui:options': {
      unit: 'personalDataForm.form.units.eurosNetPerMonth'
    }
  },
  additionalIncome: {
    'ui:widget': 'InputWithUnit',
    'ui:options': {
      unit: 'personalDataForm.form.units.eurosNetPerMonth'
    }
  },
  propertyLoan: {
    'ui:widget': 'InputWithUnit',
    'ui:options': {
      unit: 'personalDataForm.form.units.eurosPerMonth'
    }
  },
  creditsTotalAmount: {
    'ui:widget': 'InputWithUnit',
    'ui:options': {
      unit: 'personalDataForm.form.units.eurosPerMonth'
    }
  },
  email: {
    'ui:widget': 'email'
  },
  maritalStatus: {
    'ui:options': {
      isSearchable: false
    }
  },
  employmentStatus: {
    'ui:options': {
      isSearchable: false
    }
  },
  employmentContract: {
    'ui:options': {
      isSearchable: false
    }
  },
  propertyStatus: {
    'ui:options': {
      isSearchable: false
    }
  }
}

const documents = {
  identity_document: {
    label: 'identity_document',
    order: 1,
    count: 1,
    rules: {
      metadata: {
        classification: 'identity_document'
      }
    }
  },
  tax_notice: {
    label: 'tax_notice',
    order: 2,
    count: 1,
    rules: {
      metadata: {
        classification: 'tax_notice',
        subjects: {
          $in: ['income']
        }
      }
    }
  },
  payslip: {
    label: 'payslip',
    order: 3,
    count: 1,
    rules: {
      metadata: {
        classification: 'payslip'
      }
    }
  },
  bank_identity: {
    label: 'bank_identity',
    order: 4,
    count: 1,
    rules: {
      metadata: {}
    }
  },
  address_certificate: {
    label: 'address_certificate',
    order: 5,
    count: 1,
    rules: {
      metadata: {
        $or: [
          {
            classification: 'certificate',
            categories: {
              $in: ['energy']
            },
            subjects: {
              $in: ['subscription']
            }
          },
          {
            classification: 'invoicing',
            isSubscription: true,
            categories: {
              $in: ['internet', 'phone', 'energy']
            }
          },
          {
            classification: 'tax_notice',
            subjects: {
              $in: ['income', 'residence']
            }
          }
        ]
      }
    }
  }
}

export default {
  type: 'credit-application',
  description: '…',
  procedureData: {
    amount: {
      min: 1000,
      max: 12000,
      default: 3000
    },
    duration: {
      min: 2,
      max: 60,
      default: 24
    }
  },
  personalData: {
    schema,
    uiSchema
  },
  documents,
  pathToSave: '/Administratif'
}
