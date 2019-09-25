import { sendNotification } from './notifications'
import emailTemplate from './__tests__/email-layout.hbs'
import appLayout from './__tests__/app-layout.hbs'
import NotificationView from './view'

class MyNotificationView extends NotificationView {
  async fetchData() {
    this.name = 'patrick'
  }

  async prepare() {
    await this.fetchData()
  }

  buildData() {
    return { name: this.name }
  }

  shouldSend() {
    return true
  }

  getHelpers() {
    return {
      greeting: name => `Hello ${name}!`
    }
  }

  getTitle() {
    return 'Notification title'
  }

  getPushContent() {
    return 'Push content'
  }

  getPartials() {
    return {
      'app-layout': appLayout
    }
  }

  toText() {
    return 'Simple text content'
  }
}

MyNotificationView.preferredChannels = ['mail', 'mobile']
MyNotificationView.template = emailTemplate
MyNotificationView.category = 'my-category'

describe('notifications', () => {
  it('should send a notification view', async () => {
    const cozyClient = {
      stackClient: {
        fetchJSON: jest.fn(),
        uri: 'http://cozy.tools:8080'
      }
    }
    const nv = new MyNotificationView({
      client: cozyClient,
      lang: 'en',
      data: {
        name: 'Homer'
      },
      locales: {
        en: {
          hello: 'Hello %{name} !'
        }
      }
    })
    await sendNotification(cozyClient, nv)
    expect(cozyClient.stackClient.fetchJSON).toMatchSnapshot()
  })
})
