import get from 'lodash/get'

const appLinksProps = {
  drive: ({ trigger }) => ({
    slug: 'drive',
    path: `#/files/${get(trigger, 'message.folder_to_save')}`,
    icon: 'file',
    iconColor: 'puertoRico'
  }),
  banks: () => ({
    slug: 'banks',
    icon: 'bank',
    iconColor: 'weirdGreen'
  }),
  contacts: () => ({
    slug: 'contacts',
    icon: 'team',
    iconColor: 'brightSun'
  })
}

export default appLinksProps
