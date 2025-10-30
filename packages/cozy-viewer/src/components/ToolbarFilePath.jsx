import React, { useMemo } from 'react'

import { useClient, useQuery } from 'cozy-client'
import { ensureFilePath } from 'cozy-client/dist/models/file'
import FilePath from 'cozy-ui/transpiled/react/FilePath'
import Link from 'cozy-ui/transpiled/react/Link'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import AppLinker from 'cozy-ui-plus/dist/AppLinker'

import {
  makeWebLink,
  normalizeAndSpreadAttributes,
  removeFilenameFromPath
} from '../helpers'
import { useViewer } from '../providers/ViewerProvider'
import { buildFileByIdQuery } from '../queries'

const ToolbarFilePath = () => {
  const client = useClient()
  const { isDesktop } = useBreakpoints()
  const { file } = useViewer()

  const normalizeFile = normalizeAndSpreadAttributes(file)

  const parentQuery = buildFileByIdQuery(normalizeFile.dir_id)
  const parentResult = useQuery(parentQuery.definition, {
    ...parentQuery.options,
    enabled: !!normalizeFile.dir_id
  })

  const fileWithPath = useMemo(
    () =>
      parentResult.data
        ? ensureFilePath(normalizeFile, parentResult.data)
        : undefined,
    [normalizeFile, parentResult.data]
  )

  if (fileWithPath) {
    const appSlug = 'drive'
    const nativePath = fileWithPath.driveId
      ? `/shareddrive/${fileWithPath.driveId}/${fileWithPath.dir_id}`
      : `/folder/${fileWithPath.dir_id}`
    const path = removeFilenameFromPath(fileWithPath.path)
    const link = makeWebLink({ client, path: nativePath, slug: appSlug })

    if (isDesktop && link) {
      return (
        <AppLinker app={{ slug: appSlug }} nativePath={nativePath} href={link}>
          {({ href, onClick }) => (
            <Link href={href} onClick={onClick} color="inherit">
              <FilePath className="u-white">{path}</FilePath>
            </Link>
          )}
        </AppLinker>
      )
    }
    return <FilePath className={isDesktop ? 'u-white' : null}>{path}</FilePath>
  }

  return null
}

export { ToolbarFilePath }
