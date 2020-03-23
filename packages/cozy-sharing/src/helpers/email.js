// Extract emails address from a string
export const extractEmails = str => {
  if (typeof str === 'string')
    return str.match(/([a-zA-Z0-9.+_-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi)
  return null
}
// Validate if a string is an email address or not
export const validateEmail = str => {
  const reg = /([a-zA-Z0-9.+_-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/i
  return reg.test(String(str).toLowerCase())
}
