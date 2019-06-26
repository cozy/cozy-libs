import { randomDayTime } from './daytime'

const DAILY = 'daily'
const HOURLY = 'hourly'
const MONTHLY = 'monthly'
const WEEKLY = 'weekly'
const VALID_FREQUENCIES = [DAILY, HOURLY, MONTHLY, WEEKLY]

const DEFAULT_FREQUENCY = WEEKLY
// By default konnectors are run at random hour between 12:00PM and 05:00AM.
const DEFAULT_TIME_INTERVAL = [0, 5]

/**
 * Build a cron string for given konnector with given options
 * See https://docs.cozy.io/en/cozy-stack/jobs/#cron-syntax
 * @param  {string} frequency Frequency from `hourly`, `daily`, `weekly` or
 * `monthly`.
 * @param  {object} options   Object which may contain `dayOfMonth`,
 * `dayOfWeek`, hours`, `minutes`.
 * @return {string}           The cron definition for trigger
 */
export const fromFrequency = (frequency, options = {}) => {
  const sanitizedFrequency = VALID_FREQUENCIES.includes(frequency)
    ? frequency
    : DEFAULT_FREQUENCY

  const { dayOfMonth = 1, dayOfWeek = 1, hours = 0, minutes = 0 } = options

  switch (sanitizedFrequency) {
    case DAILY:
      return `0 ${minutes} ${hours} * * *`
    case HOURLY:
      return `0 ${minutes} * * * *`
    case MONTHLY:
      return `0 ${minutes} ${hours} ${dayOfMonth} * *`
    default:
      // also WEEKLY
      return `0 ${minutes} ${hours} * * ${dayOfWeek}`
  }
}

export const fromKonnector = (
  konnector,
  startDate = new Date(),
  randomDayTimeFn = randomDayTime
) =>
  cron.fromFrequency(konnector.frequency, {
    ...randomDayTimeFn.apply(
      null,
      konnector.time_interval || DEFAULT_TIME_INTERVAL
    ),
    dayOfWeek: startDate.getDay(),
    dayOfMonth: startDate.getDate()
  })

/**
 * Transform the given cron string into frequency value
 * @param  {String} cron cron value
 * @return {String}      Frequency, could be `daily`,
 * `hourly`, `monthly`, `weekly`, or null if undetermined
 */
export const toFrequency = cron => {
  const isSet = part => part !== '*'
  const [, minutes, hours, dayOfMonth, , dayOfWeek] = cron.split(' ')
  if (isSet(dayOfWeek)) return WEEKLY
  if (isSet(dayOfMonth)) return MONTHLY
  if (isSet(hours)) return DAILY
  if (isSet(minutes)) return HOURLY
  return null
}

const cron = {
  fromFrequency,
  fromKonnector,
  toFrequency
}

export default cron
