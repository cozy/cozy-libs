const schema = {
  type: 'object',
  properties: {
    lastname: {
      title: 'creditApplication.lastname.title',
      type: 'string'
    },
    firstname: {
      title: 'creditApplication.firstname.title',
      type: 'string'
    },
    maritalStatus: {
      title: 'creditApplication.maritalStatus.title',
      type: 'string',
      enum: ['single', 'maried', 'pacs'],
      enumNames: [
        'creditApplication.maritalStatus.single',
        'creditApplication.maritalStatus.maried',
        'creditApplication.maritalStatus.pacs'
      ]
    },
    numberOfKids: {
      title: 'creditApplication.numberOfKids.title',
      type: 'number',
      minimum: 0
    },
    employmentStatus: {
      title: 'creditApplication.employmentStatus.title',
      type: 'string',
      enum: ['employee', 'freelance', 'unemployed', 'retired'],
      enumNames: [
        'creditApplication.employmentStatus.employee',
        'creditApplication.employmentStatus.freelance',
        'creditApplication.employmentStatus.unemployed',
        'creditApplication.employmentStatus.retired'
      ]
    },
    employmentContract: {
      title: 'creditApplication.employmentContract.title',
      type: 'string',
      enum: ['cdd', 'cdi'],
      enumNames: [
        'creditApplication.employmentContract.cdd',
        'creditApplication.employmentContract.cdi'
      ]
    },
    salary: {
      title: 'creditApplication.salary.title',
      type: 'number'
    },
    additionalIncome: {
      title: 'creditApplication.additionalIncome.title',
      type: 'number'
    },
    propertyStatus: {
      title: 'creditApplication.propertyStatus.title',
      type: 'string',
      enum: ['owner', 'tenant'],
      enumNames: [
        'creditApplication.propertyStatus.owner',
        'creditApplication.propertyStatus.tenant'
      ]
    },
    propertyLoan: {
      title: 'creditApplication.propertyLoan.title',
      type: 'number'
    },
    creditsTotalAmount: {
      title: 'creditApplication.creditsTotalAmount.title',
      type: 'number'
    },
    address: {
      title: 'creditApplication.address.title',
      type: 'string'
    },
    phone: {
      title: 'creditApplication.phone.title',
      type: 'string'
    },
    email: {
      title: 'creditApplication.email.title',
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
      unit: 'creditApplication.units.eurosNetPerMonth'
    }
  },
  additionalIncome: {
    'ui:widget': 'InputWithUnit',
    'ui:options': {
      unit: 'creditApplication.units.eurosNetPerMonth'
    }
  },
  propertyLoan: {
    'ui:widget': 'InputWithUnit',
    'ui:options': {
      unit: 'creditApplication.units.eurosPerMonth'
    }
  },
  creditsTotalAmount: {
    'ui:widget': 'InputWithUnit',
    'ui:options': {
      unit: 'creditApplication.units.eurosPerMonth'
    }
  },
  email: {
    'ui:widget': 'email'
  }
}

export default {
  name: 'Credit Application',
  type: 'credit-application',
  description: '…',
  amount: 30000,
  duration: 24,
  personalData: {
    schema,
    uiSchema
  }
}
