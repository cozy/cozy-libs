import { getSSL, getUrlAndHost, setAppName } from './helpers'

const getProps = (cozyURL, sslOption) => {
  const ssl = getSSL(cozyURL, sslOption)
  const { url, host } = getUrlAndHost(cozyURL, ssl)
  return {
    ssl,
    url,
    host
  }
}

export default {
  getProps,
  setAppName
}
