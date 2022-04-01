import { makeBlobWithCustomAttrs } from 'src/helpers/makeBlobWithCustomAttrs'

describe('makeBlobWithCustomAttrs', () => {
  const blob = new Blob(['{data: "value"}'], { type: 'application/json' })

  it('should return Blob', () => {
    const res = makeBlobWithCustomAttrs(blob, {})
    expect(res.constructor).toEqual(Blob)
  })

  it('should set the properties provided', () => {
    const res = makeBlobWithCustomAttrs(blob, { id: '01', name: 'my blob' })
    expect(res).toHaveProperty('id', '01')
    expect(res).toHaveProperty('name', 'my blob')
  })

  it('should return Blob with original type', () => {
    const res = makeBlobWithCustomAttrs(blob, {})
    expect(res.type).toEqual('application/json')
  })
})
