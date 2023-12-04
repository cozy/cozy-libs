import { UnrunnableAlert } from './UnrunnableAlert'

const meta = {
  component: UnrunnableAlert
}

export default meta

export const Default = {
  name: 'Default',
  args: {
    konnectorName: 'EDF'
  }
}

export const WithoutIcon = {
  name: 'Without icon',
  args: {
    konnectorName: 'EDF',
    withoutIcon: true
  }
}
