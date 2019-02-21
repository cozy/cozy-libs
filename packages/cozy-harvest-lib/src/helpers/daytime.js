import isInteger from 'lodash/isInteger'
/**
 * Returns an hour of the day between two hours given in parameters
 * @type {integer} min minimal start hour
 * @type {integer} max maximal end hour
 * @type {function} randomize The function used to generate random values
 * @return {object} Object containing two atributes : hours and minutes
 */
export const randomDayTime = (
  start = 0,
  end = 1,
  randomize = (min, max) => Math.random() * (max - min) + min
) => {
  if (!isInteger(start)) throw new Error('Parameter start must be an integer')
  if (!isInteger(end)) throw new Error('Parameter end must be an integer')

  if (typeof randomize !== 'function')
    throw new Error('Parameter randomize must be a function')

  if (start < 0 || end > 24) throw new Error('interval must be inside [0, 24]')

  const r = randomize(start, end)
  const hours = Math.floor(r)
  const minutes = Math.floor((r - hours) * 60)

  if (hours < 0 || hours > 23)
    throw new Error('randomize function returns invalid hour value')

  return { hours, minutes }
}
