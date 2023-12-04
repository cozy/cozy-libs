import { MaintenanceAlert } from './MaintenanceAlert'

const meta = {
  component: MaintenanceAlert,
  args: {
    label: 'Sync. il y a 2 mois',
    messages: {
      en: {
        long_message:
          "We're currently working on this service. Please try again later."
      }
    },
    withDescription: false
  }
}

export default meta

export const Default = {
  name: 'Default',
  args: {}
}

export const withDescription = {
  name: 'With description',
  args: {
    withDescription: true
  }
}
