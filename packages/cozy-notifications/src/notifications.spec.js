import { sendNotification } from './notifications'
import emailTemplate from './__tests__/email-layout.hbs'
import appLayout from './__tests__/app-layout.hbs'

class NotificationView {
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

NotificationView.preferredChannels = ['mail', 'mobile']
NotificationView.template = emailTemplate
NotificationView.category = 'my-category'

describe('notifications', () => {
  it('should send a notification view', async () => {
    const cozyClient = {
      fetchJSON: jest.fn()
    }
    const nv = new NotificationView()
    await sendNotification(cozyClient, nv)
    expect(cozyClient.fetchJSON).toMatchSnapshot()
  })
})
