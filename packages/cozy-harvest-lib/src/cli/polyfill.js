const jsdom = require('jsdom')
const { JSDOM } = jsdom
const dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`, {
  url: 'https://example.org/'
})

global.WebSocket = require('ws')
global.FormData = require('form-data')

global.window = dom.window
global.document = dom.window.document
global.addEventListener = dom.window.addEventListener
global.removeEventListener = dom.window.removeEventListener

global.window.getComputedStyle = () => ({
  getPropertyValue: () => '#fff'
})
