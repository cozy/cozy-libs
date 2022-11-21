import MicroEE from 'microee'

function PopupMock() {
  this.closed = false

  this.focus = jest.fn()
  this.close = jest.fn().mockImplementation(() => {
    this.closed = true
  })

  this.addEventListener = jest.fn().mockImplementation((name, fn) => {
    this.on(name, fn)
  })
  this.removeEventListener = jest.fn().mockImplementation((name, fn) => {
    this.removeListener(name, fn)
  })

  this.clear = () => {
    this.closed = false
    this.removeAllListeners()
    this.focus.mockClear()
    this.close.mockClear()
    this.addEventListener.mockClear()
    this.removeEventListener.mockClear()
  }
}

MicroEE.mixin(PopupMock)

export default PopupMock
