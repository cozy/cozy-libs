import { RunnableAlert } from './RunnableAlert'

const meta = {
  component: RunnableAlert,
  args: {
    label: 'Sync. il y a 2 mois',
    isRunning: false,
    konnectorSlug: 'dummy',
    konnectorRoot: '/konnector/dummy',
    trigger: {},
    error: undefined,
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
  args: {
    label: 'Sync. il y a 2 mois'
  }
}

export const Running = {
  name: 'Running',
  args: {
    label: 'Date de sync. inconnue',
    isRunning: true
  }
}

export const NotRunnable = {
  name: 'Not runnable',
  args: {
    isRunnable: false
  }
}
