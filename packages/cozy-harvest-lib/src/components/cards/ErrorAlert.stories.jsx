import { ErrorAlert } from './ErrorAlert'
import { KonnectorJobError } from '../../helpers/konnectors'

const meta = {
  component: ErrorAlert,
  args: {
    label: 'Sync. il y a 2 mois',
    error: new KonnectorJobError('LOGIN_FAILED'),
    konnectorRoot: '/konnector/dummy',
    trigger: {},
    flow: {
      konnector: {
        name: 'Dummy',
        type: 'konnector',
        slug: 'dummy',
        locales: {
          en: {
            description: 'Konnector used for debug purpose',
            fields: {
              date: {
                label: 'Date'
              },
              error: {
                label: 'Intended error'
              }
            }
          }
        }
      }
    },
    account: {},
    intentsApi: {},
    isRunnable: true
  }
}

export default meta

export const Default = {
  name: 'Default',
  args: {}
}

export const NotRunnable = {
  name: 'Not runnable',
  args: {
    isRunnable: false
  }
}
