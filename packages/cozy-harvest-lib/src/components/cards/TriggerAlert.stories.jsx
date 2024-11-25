import { TriggerAlert } from './TriggerAlert'
import { KonnectorJobError } from '../../helpers/konnectors'

const meta = {
  component: TriggerAlert,
  args: {
    trigger: {},
    isInMaintenance: false,
    isInError: false,
    isRunnable: true,
    isRunning: false,
    expectingTriggerLaunch: false,
    withMaintenanceDescription: false,
    error: new KonnectorJobError('LOGIN_FAILED'),
    maintenanceMessages: {
      en: {
        long_message:
          "We're currently working on this service. Please try again later."
      }
    },
    account: {},
    konnectorRoot: '/konnector/dummy',
    intentsApi: {},
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
    }
  }
}

export default meta

export const Default = {
  name: 'Default'
}
