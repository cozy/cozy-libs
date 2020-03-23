// Extract emails address from a string
export const extractEmails = str => {
  if (typeof str === 'string') return str.match(/([\w.+-]+@[\w.-]+\.[\w-]+)/gi)
  return null
}
// Validate if a string is an email address or not
export const validateEmail = str => {
  const reg = /([\w.+-]+@[\w.-]+\.[\w-]+)/i
  return reg.test(String(str).toLowerCase())
}
