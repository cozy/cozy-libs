describe('browserslist', () => {
  it('should contain all Cozy supported browsers', () => {
    expect(require('./')).toMatchSnapshot()
  })
})
