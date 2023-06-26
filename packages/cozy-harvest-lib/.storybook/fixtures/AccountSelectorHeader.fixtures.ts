export const AccountSelectorHeaderFixtures = {
  konnector: {
    type: 'konnector',
    id: 'io.cozy.konnectors/stub',
    attributes: {
      banksTransactionRegExp: '(someRegex)',
      categories: ['insurance'],
      checksum: '1337',
      created_at: '2023-03-29T10:24:07.4799633+02:00',
      data_types: ['bill'],
      developer: {
        name: 'John Doe',
        url: 'https://john.doe.it'
      },
      editor: 'Cozy',
      features: [
        'LOGIN_OK',
        'METADATA_DEDUP',
        'IDENTITY',
        'DOC_QUALIFICATION',
        'HEALTH',
        'CARBON_COPY',
        'SENTRY_V2'
      ],
      fields: {
        login: {
          max: 13,
          min: 13,
          type: 'text'
        },
        password: {
          type: 'password'
        }
      },
      folders: [
        {
          defaultDir: '$administrative/$konnector/$account'
        }
      ],
      icon: 'icon.svg',
      langs: ['fr'],
      language: 'node',
      locales: {
        en: {
          long_description: 'long description',
          permissions: {
            accounts: {
              description: "Required to get the account's data"
            },
            'bank operations': {
              description: 'Required to link bills to bank operations'
            },
            bills: {
              description: 'Required to save the bills data'
            },
            carboncopy: {
              description: 'Required for carbon copy documents'
            },
            files: {
              description: 'Required to save the bills'
            },
            identities: {
              description: 'Required to save your identity'
            }
          },
          short_description: 'Retrieves all your stub invoices'
        },
        fr: {
          fields: {
            login: {
              label: 'Numéro de sécurité sociale',
              placeholder: '13 chiffres'
            }
          },
          long_description: 'long description',
          permissions: {
            accounts: {
              description: 'Utilisé pour obtenir les données du compte'
            },
            'bank operations': {
              description:
                'Utilisé pour lier les factures aux opérations bancaires'
            },
            bills: {
              description: 'Utilisé pour sauvegarder les données des factures'
            },
            carboncopy: {
              description:
                "Utilisé pour certifier que vos fichiers sont copie conforme avec les documents d'origine"
            },
            files: {
              description: 'Utilisé pour sauvegarder les factures'
            },
            identities: {
              description: 'Utilisé pour sauvegarder votre identité'
            }
          },
          short_description:
            'Récupère dans votre Cozy les relevés de remboursements, votre attestations et vos messages'
        }
      },
      manifest_version: '2',
      name: 'Stub',
      permissions: {
        'bank operations': {
          type: 'io.cozy.bank.operations'
        },
        bills: {
          type: 'io.cozy.bills'
        },
        files: {
          type: 'io.cozy.files'
        },
        carbon_copy: {
          type: 'io.cozy.certified.carbon_copy'
        },
        accounts: {
          type: 'io.cozy.accounts'
        },
        identities: {
          type: 'io.cozy.identities'
        }
      },
      slug: 'stub',
      source: 'registry://stub/stable',
      state: 'ready',
      time_interval: [0, 24],
      type: 'konnector',
      updated_at: '2023-03-29T10:24:07.4799636+02:00',
      vendor_link: 'https://stub.it',
      version: '1.18.0'
    },
    meta: {
      rev: '1'
    },
    links: {
      self: '/konnectors/stub',
      icon: '/konnectors/stub/icon/1',
      permissions: '/permissions/konnectors/stub'
    },
    banksTransactionRegExp: '(someRegex)',
    checksum:
      'f7e732e7afc7f6b5f697c375aba570424aa6b28590b380203ef9849a071e87c7',
    created_at: '2023-03-29T10:24:07.4799633+02:00',
    editor: 'Cozy',
    icon: 'icon.svg',
    language: 'node',
    manifest_version: '2',
    name: 'Stub',
    slug: 'stub',
    source: 'registry://stub/stable',
    state: 'ready',
    updated_at: '2023-03-29T10:24:07.4799636+02:00',
    vendor_link: 'https://stub.it',
    version: '1',
    _type: 'io.cozy.konnectors',
    triggers: {
      data: [
        {
          type: '@cron',
          id: '1337',
          attributes: {
            _id: '1337',
            _rev: '1',
            domain: 'dev:8080',
            prefix: 'dev1337',
            type: '@cron',
            worker: 'konnector',
            arguments: '0 11 2 * * 3',
            debounce: '',
            options: null,
            message: {
              account: '1337',
              konnector: 'stub',
              folder_to_save: '1337'
            },
            current_state: {
              trigger_id: '1337',
              status: 'done',
              last_success: '2023-06-23T10:37:40.6638338+02:00',
              last_successful_job_id: '1337',
              last_execution: '2023-06-23T10:37:40.6638338+02:00',
              last_executed_job_id: '1337',
              last_failure: '2023-04-26T09:10:39.4642864+02:00',
              last_failed_job_id: '1337',
              last_error: 'VENDOR_DOWN',
              last_manual_execution: '2023-06-23T10:37:40.6638338+02:00',
              last_manual_job_id: '1337'
            },
            cozyMetadata: {
              doctypeVersion: '1',
              metadataVersion: 1,
              createdAt: '2023-03-29T10:25:41.8226664+02:00',
              createdByApp: 'home',
              updatedAt: '2023-03-29T10:25:41.8226664+02:00'
            }
          },
          meta: {},
          links: {
            self: '/jobs/triggers/1337'
          },
          _id: '1337',
          _rev: '1',
          domain: 'dev:8080',
          prefix: 'dev1337',
          worker: 'konnector',
          arguments: '0 11 2 * * 3',
          debounce: '',
          options: null,
          _type: 'io.cozy.triggers'
        }
      ]
    }
  },
  account: {
    id: '1337',
    _id: '1337',
    _type: 'io.cozy.accounts',
    _rev: '1',
    account_type: 'stub',
    auth: {
      credentials_encrypted: '1337',
      login: '1 55 55 12 784 125'
    },
    cozyMetadata: {
      createdAt: '2023-03-29T10:25:41.6712839+02:00',
      createdByApp: 'home',
      doctypeVersion: '',
      metadataVersion: 1,
      updatedAt: '2023-06-23T08:37:37.541Z',
      updatedByApps: [
        {
          date: '2023-06-23T08:37:37.541Z'
        },
        {
          date: '2023-03-29T10:25:41.6712839+02:00',
          slug: 'home'
        }
      ]
    },
    defaultFolderPath: '/Stub/1 55 55 12 784 125',
    identifier: 'login',
    name: '1 55 55 12 784 125',
    state: 'LOGIN_SUCCESS'
  },
  accountsAndTriggers: [
    {
      account: {
        id: '1337',
        _id: '1337',
        _type: 'io.cozy.accounts',
        _rev: '1',
        account_type: 'stub',
        auth: {
          credentials_encrypted: '1337',
          login: '1 55 55 12 784 125'
        },
        cozyMetadata: {
          createdAt: '2023-03-29T10:25:41.6712839+02:00',
          createdByApp: 'home',
          doctypeVersion: '',
          metadataVersion: 1,
          updatedAt: '2023-06-23T08:37:37.541Z',
          updatedByApps: [
            {
              date: '2023-06-23T08:37:37.541Z'
            },
            {
              date: '2023-03-29T10:25:41.6712839+02:00',
              slug: 'home'
            }
          ]
        },
        defaultFolderPath: '/Stub/1 55 55 12 784 125',
        identifier: 'login',
        name: '1 55 55 12 784 125',
        state: 'LOGIN_SUCCESS'
      },
      trigger: {
        type: '@cron',
        id: '1337',
        attributes: {
          _id: '1337',
          _rev: '1',
          domain: 'dev:8080',
          prefix: 'dev1337',
          type: '@cron',
          worker: 'konnector',
          arguments: '0 11 2 * * 3',
          debounce: '',
          options: null,
          message: {
            account: '1337',
            konnector: 'stub',
            folder_to_save: '1337'
          },
          current_state: {
            trigger_id: '1337',
            status: 'done',
            last_success: '2023-06-23T10:37:40.6638338+02:00',
            last_successful_job_id: '1337',
            last_execution: '2023-06-23T10:37:40.6638338+02:00',
            last_executed_job_id: '1337',
            last_failure: '2023-04-26T09:10:39.4642864+02:00',
            last_failed_job_id: '1337',
            last_error: 'VENDOR_DOWN',
            last_manual_execution: '2023-06-23T10:37:40.6638338+02:00',
            last_manual_job_id: '1337'
          },
          cozyMetadata: {
            doctypeVersion: '1',
            metadataVersion: 1,
            createdAt: '2023-03-29T10:25:41.8226664+02:00',
            createdByApp: 'home',
            updatedAt: '2023-03-29T10:25:41.8226664+02:00'
          }
        },
        meta: {},
        links: {
          self: '/jobs/triggers/1337'
        },
        _id: '1337',
        _rev: '1',
        domain: 'dev:8080',
        prefix: 'dev1337',
        worker: 'konnector',
        arguments: '0 11 2 * * 3',
        debounce: '',
        options: null,
        _type: 'io.cozy.triggers'
      }
    }
  ]
}
