const PromisePool = require('es6-promise-pool')

/**
 * Like a map, executed in parallel via a promise pool
 *
 * @param  {Array}    arr          Items to process
 * @param  {Function} fn           Promise creator (will be passed each item)
 * @param  {Number}   concurrency  How many promise can be in flight at the same time
 * @return {Promise}               Resolved with the results of the promise, not necessary in order
 */
const parallelMap = (iterable, fn, concurrency) => {
  concurrency = concurrency || 30
  const res = []
  const pool = new PromisePool(function*() {
    for (let item of iterable) {
      yield fn(item).then(x => res.push(x))
    }
  }, concurrency)
  return pool.start().then(() => res)
}

module.exports = {
  parallelMap
}
