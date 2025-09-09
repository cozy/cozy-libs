/** *
 * We need to target Android 5 and at least iOS 10 for our mobile apps.
 * We have to target Android 4.4 since Android 5 doesn't exist because Webview and OS
 * version are different since Android 5.
 * We didn't find any query targeting Android 5 with a very old browser (ie no updated),
 * we can consider targeting Samsung browser since it should follow Android Browser
 * but I'm not sure this is the right way to do.
 * Changed to 3 last majors version of iOS because I think 2 is pretty dangerous specially when a new iOS version is released.
 */
module.exports = [
  'last 2 Chrome major versions',
  'last 2 Firefox major versions',
  'last 2 FirefoxAndroid major versions',
  'last 2 Safari major versions',
  'last 3 iOS major versions',
  'last 2 Edge major versions',
  'Firefox ESR',
  'Android 4.4',
  '> 1% in FR',
  'not dead',
  'not ie <= 11'
]
