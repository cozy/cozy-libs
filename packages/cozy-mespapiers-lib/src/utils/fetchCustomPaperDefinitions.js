import { Q, fetchPolicies } from 'cozy-client'

import { FILES_DOCTYPE } from '../doctypes'
import getOrCreateAppFolderWithReference from '../helpers/getFolderWithReference'

const paperConfigFilenameCustom = 'papersDefinitions.json'

/**
 * Fetch custom PaperDefinitions file in "My papers" folder (Drive)
 * @param {CozyClient} client - Instance of CozyClient
 * @param {Function} t - i18n function
 * @returns {Promise<{ paperConfigFilenameCustom: string, appFolderPath: string, data: object|null }>}
 */
export const fetchCustomPaperDefinitions = async (client, t) => {
  try {
    const { _id: appFolderId, path } = await getOrCreateAppFolderWithReference(
      client,
      t
    )
    const queryDef = Q(FILES_DOCTYPE)
      .where({ dir_id: appFolderId, name: paperConfigFilenameCustom })
      .partialIndex({ trashed: false })
      .indexFields(['name', 'dir_id'])

    const { data } = await client.query(queryDef, {
      as: `fetchJsonFileByName`,
      fetchPolicy: fetchPolicies.noFetch()
    })

    return {
      paperConfigFilenameCustom,
      appFolderPath: path,
      file: data[0] ? data[0] : null
    }
  } catch (error) {
    return { paperConfigFilenameCustom, appFolderPath: '', file: null }
  }
}
