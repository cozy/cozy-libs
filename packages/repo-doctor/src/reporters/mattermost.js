const fetch = require('node-fetch')

const symbolBySeverity = {
  warn: '⚠️',
  success: '✅',
  error: '🚩',
  info: 'ℹ️'
}

class MattermostReporter {
  constructor() {
    this.checkEnv()
    this.messages = []
  }

  checkEnv() {
    if (!process.env.MATTERMOST_HOOK) {
      throw new Error('To be instantiated, mattermost reporter needs process.env.MATTERMOST_HOOK')
    }
  }

  write(msg) {
    this.messages.push(msg)
  }

  async sendAllMessages() {
    const payload = {
      channel: '@patrick',
      text: this.messages.map(x => {
        const symbol = symbolBySeverity[x.severity]
        return `${x.type || ''} ${symbol || ''} ${x.message}`
      }).join('\n')
    }

    const res = await fetch(process.env.MATTERMOST_HOOK, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(payload)
    })
    console.log(res)
  }

  async flush() {
    await this.sendAllMessages()
    this.messages = []
  }
}

module.exports = MattermostReporter
