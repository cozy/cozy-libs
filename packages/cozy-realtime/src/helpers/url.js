export const isSecureURL = url => !!url.match(`^(https:/{2})`)

export default {
  isSecureURL
}
