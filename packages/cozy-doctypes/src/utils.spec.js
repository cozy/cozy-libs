const { parallelMap } = require('./utils')

describe('parallel map', () => {
  it('should map and return results', async () => {
    const res = await parallelMap(
      [1, 2, 3, 4, 5],
      x => {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve(x * 2)
          }, Math.random() * 10)
        })
      },
      10
    )

    const numericalSort = (a, b) => (a < b ? -1 : 1)
    res.sort(numericalSort)
    expect(res).toEqual([2, 4, 6, 8, 10])
  })
})
