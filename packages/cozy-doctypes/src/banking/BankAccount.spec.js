const BankAccount = require('./BankAccount')

describe('account reconciliation', () => {
  it('should update connection of disabled accounts without connection with the one of matching fetched accounts', () => {
    const newAccounts = [
      {
        number: '1',
        balance: 100,
        relationships: {
          connection: {
            data: {
              _id: 'cozyaccountnew',
              _type: 'io.cozy.accounts'
            }
          }
        },
        metadata: {
          updatedAt: '2020-11-30'
        }
      },
      {
        number: '10',
        balance: 33,
        relationships: {
          connection: {
            data: {
              _id: 'cozyaccountnew',
              _type: 'io.cozy.accounts'
            }
          }
        },
        metadata: {
          updatedAt: '2020-11-30'
        }
      }
    ]
    const currentAccounts = [
      {
        _id: 'a1',
        number: '1',
        balance: 50,
        relationships: {
          connection: {
            data: {
              _id: 'cozyaccountold',
              _type: 'io.cozy.accounts'
            }
          }
        },
        metadata: {
          updatedAt: '2020-11-30'
        }
      },
      {
        _id: 'a2',
        number: '2',
        balance: 300,
        relationships: {
          connection: {
            data: {
              _id: 'cozyaccountold',
              _type: 'io.cozy.accounts'
            }
          }
        },
        metadata: {
          updatedAt: '2020-11-30'
        }
      },
      {
        _id: 'oldaccountnorelationship',
        number: '10',
        balance: 0,
        relationships: {
          other: {
            data: {
              some: 'data'
            }
          }
        },
        metadata: {
          updatedAt: '2012-11-30'
        }
      },
      {
        _id: 'otheraccountnorelationship',
        number: '20',
        balance: 130,
        relationships: {},
        metadata: {
          updatedAt: '2012-11-30'
        }
      }
    ]
    const matchedAccounts = BankAccount.reconciliate(
      newAccounts,
      currentAccounts
    )

    expect(matchedAccounts).toEqual([
      {
        _id: 'a1',
        number: '1',
        rawNumber: '1',
        balance: 100,
        relationships: {
          connection: {
            data: {
              _id: 'cozyaccountnew',
              _type: 'io.cozy.accounts'
            }
          }
        },
        metadata: {
          updatedAt: '2020-11-30'
        }
      },
      {
        _id: 'oldaccountnorelationship',
        number: '10',
        rawNumber: '10',
        balance: 33,
        relationships: {
          connection: {
            data: {
              _id: 'cozyaccountnew',
              _type: 'io.cozy.accounts'
            }
          },
          other: {
            data: {
              some: 'data'
            }
          }
        },
        metadata: {
          updatedAt: '2020-11-30'
        }
      },
      {
        _id: 'a2',
        number: '2',
        balance: 300,
        relationships: {
          connection: {
            data: {
              _id: 'cozyaccountnew',
              _type: 'io.cozy.accounts'
            }
          }
        },
        metadata: {
          disabledAt: '2020-11-30',
          updatedAt: '2020-11-30'
        }
      }
    ])
  })

  it('should correctly match linxo accounts to cozy accounts through number', () => {
    const newAccounts = [
      {
        number: '1',
        balance: 100,
        relationships: {
          aRelationship: { _id: 'fake-id', _type: 'fake-type' },
          anotherRelationship: { _id: 'fake-id2', _type: 'fake-type2' }
        }
      },
      { number: '2', balance: 200 }
    ]
    const currentAccounts = [
      {
        _id: 'a1',
        number: '1',
        balance: 50,
        relationships: {
          aRelationship: { _id: 'old-fake-id', _type: 'old-fake-type' }
        }
      }
    ]
    const matchedAccounts = BankAccount.reconciliate(
      newAccounts,
      currentAccounts
    )

    const accountA1 = matchedAccounts.find(x => x.number === '1')
    expect(accountA1._id).toBe('a1')
    expect(accountA1.relationships).toEqual({
      aRelationship: { _id: 'fake-id', _type: 'fake-type' }, // aRelationship is updated
      anotherRelationship: { _id: 'fake-id2', _type: 'fake-type2' } // anotherRelationship is kept
    })
    expect(matchedAccounts.find(x => x.number !== '1')._id).toBe(undefined)
    expect(matchedAccounts.length).toBe(2)
  })
})

describe('deleteDuplicateBankAccountsWithNoOperations', () => {
  it('should return duplicate with no operations', () => {
    const res = BankAccount.findDuplicateAccountsWithNoOperations(
      [
        { _id: 'empty', label: 'Duplicate account' },
        { _id: 'filled', label: 'Duplicate account' },
        { _id: 'filled_not_duplicate', label: 'Account with ops' },
        {
          _id: 'duplicate_across_institution',
          institutionLabel: 'Bank 1',
          label: 'Duplicate across institution'
        },
        {
          _id: 'duplicate_across_institution',
          institutionLabel: 'Bank 2',
          label: 'Duplicate across institution'
        }
      ],
      [
        { _id: 'op1', account: 'filled' },
        { _id: 'op2', account: 'filled' },
        { _id: 'op3', account: 'filled' },
        { _id: 'op4', account: 'filled' },
        { _id: 'op5', account: 'filled_not_duplicate' },
        { _id: 'op6', account: 'filled_not_duplicate' },
        { _id: 'op7', account: 'filled_not_duplicate' }
      ]
    )

    expect(res.map(x => x._id)).toEqual(['empty'])
  })
})

describe('incoherences', () => {
  const incoherent = {
    institutionLabel: "Caisse d'Épargne Particuliers",
    cozyMetadata: {
      createdByApp: 'boursorama'
    }
  }

  const coherent = {
    institutionLabel: "Caisse d'Épargne Particuliers",
    cozyMetadata: {
      createdByApp: 'caissedepargne1'
    }
  }

  const unknown = {
    institutionLabel: 'Unknown bank',
    cozyMetadata: {
      createdByApp: 'unknown1337'
    }
  }

  const noMetadata = {
    institutionLabel: "Caisse d'Épargne Particuliers"
  }

  const noCreatedByApp = {
    institutionLabel: "Caisse d'Épargne Particuliers",
    cozyMetadata: {}
  }

  it('should detect when slug is not coherent with createdByApp', () => {
    expect(BankAccount.hasIncoherentCreatedByApp(incoherent)).toBe(true)
    expect(BankAccount.hasIncoherentCreatedByApp(coherent)).toBe(false)
    expect(BankAccount.hasIncoherentCreatedByApp(unknown)).toBe(false)
    expect(BankAccount.hasIncoherentCreatedByApp(noMetadata)).toBe(false)
    expect(BankAccount.hasIncoherentCreatedByApp(noCreatedByApp)).toBe(false)
  })
})

describe('getUpdatedAt', () => {
  let account

  beforeEach(() => {
    account = {
      metadata: {
        updatedAt: '2019-05-01T16:09:00'
      },
      cozyMetadata: {
        updatedAt: '2019-05-02T15:36:00'
      }
    }
  })

  it("should return metadata.updatedAt if it's defined", () => {
    expect(BankAccount.getUpdatedAt(account)).toBe('2019-05-01T16:09:00')
  })

  it('should return cozyMetadata.updatedAt if metadata.updatedAt is not defined', () => {
    delete account.metadata

    expect(BankAccount.getUpdatedAt(account)).toBe('2019-05-02T15:36:00')
  })

  it('should return null if neither cozyMetadata.updatedAt nor metadata.updatedAt is defined', () => {
    expect(BankAccount.getUpdatedAt({})).toBe(null)
  })
})
