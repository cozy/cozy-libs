import get from 'lodash/get'
import UriMatchType from 'cozy-keys-lib/transpiled/UriMatchType'
import CipherType from 'cozy-keys-lib/transpiled/CipherType'
import { fetchDecryptedAccount, fetchKonnectorForAccountId } from './utils'
import logger from 'cozy-logger'
const log = logger.namespace('createCipher')

const accountToCipher = async (cozyClient, vaultClient, accountDocument) => {
  log('info', 'go start')

  try {
    const account = await fetchDecryptedAccount(cozyClient, accountDocument._id)
    const login = get(account, 'auth.login')
    const password = get(account, 'auth.password')
    if (!login || !password) {
      throw new Error('DECRYPT_FAILED')
    }
    if (get(account, 'relationships.vaultCipher')) {
      // The cipher exists: nothing to do
      return
    }
    const manifest = await fetchKonnectorForAccountId(cozyClient, account._id)
    if (!manifest) {
      return
    }
    const name = get(manifest, 'data.attributes.name')
    const link = get(manifest, 'data.attributes.vendor_link')

    const cipherData = {
      id: null,
      type: CipherType.Login,
      name: name,
      login: {
        username: login,
        password,
        uris: link ? [{ uri: link, match: UriMatchType.Domain }] : []
      }
    }
    const cipher = await vaultClient.createNewCozySharedCipher(cipherData, null)
    await vaultClient.saveCipher(cipher)
  } catch (err) {
    log('error', err)
  }

  //createCipher(login, password, url)
}

export default accountToCipher
