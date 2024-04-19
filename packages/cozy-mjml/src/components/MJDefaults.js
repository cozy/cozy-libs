const reduce = require('lodash/reduce')
const core = require('mjml-core')
const validator = require('mjml-validator')

validator.registerDependencies({
  'mj-head': ['mj-defaults'],
  'mj-defaults': []
})

function buildCSS(className, styles) {
  const rules = reduce(
    styles,
    (output, value, name) => {
      return `${output}${name}:${value};`
    },
    ''
  )
  return `.${className}{${rules}}\n`
}

class MJDefaults extends core.HeadComponent {
  handler() {
    const { add } = this.context

    const highlight = { color: '#297ef2', 'font-weight': 'bold' }
    const primaryLink = {
      color: '#297ef2',
      'text-decoration': 'none',
      'font-weight': 'bold'
    }

    // Load the Lato font from Google APIs
    add('fonts', 'Lato', 'https://fonts.googleapis.com/css?family=Lato')

    // Set some default attributes
    add('defaultAttributes', 'mj-all', {
      'font-family': 'Lato,Arial',
      color: '#32363f',
      'font-size': '16px',
      'line-height': '1.5'
    })

    // Create some classes
    add('classes', 'content-small', { padding: '0 24px 8px' })
    add('classes', 'content-medium', { padding: '0 24px 16px' })
    add('classes', 'content-large', { padding: '0 24px 24px' })
    add('classes', 'content-xlarge', { padding: '0 24px 32px' })
    add('classes', 'highlight', highlight)
    add('classes', 'title', {
      color: '#95999d',
      'text-transform': 'uppercase',
      'font-size': '12px',
      'font-weight': 'bold'
    })
    add('classes', 'title-h2', {
      'font-size': '18px',
      'font-weight': 'bold'
    })
    add('classes', 'primary-button', {
      'inner-padding': '10px 16px',
      'background-color': '#297ef2',
      'border-radius': '2px',
      color: '#fff',
      'text-transform': 'uppercase',
      'font-size': '14px',
      'font-weight': 'bold',
      'line-height': '1.43'
    })
    add(
      'classes',
      'primary-link',
      Object.assign(
        {
          'background-color': 'transparent',
          padding: '0',
          'inner-padding': '10px 8px'
        },
        primaryLink
      )
    )

    // Create some styles duplication for HTML elements
    add('style', buildCSS('primary-link', primaryLink))
    add('style', buildCSS('highlight', highlight))
  }
}

MJDefaults.tagOmission = true

module.exports = MJDefaults
