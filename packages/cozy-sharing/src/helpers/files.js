export const getFilesPaths = async (client, doctype, files) => {
  const parentDirIds = files
    .map(f => f.dir_id)
    .filter((f, idx, arr) => arr.indexOf(f) === idx)
  const parentDirs = await client
    .collection(doctype)
    .all({ keys: parentDirIds })
  const filePaths = files.map(f => {
    const parentDirPath = parentDirs.data.find(d => d.id === f.dir_id).path
    return parentDirPath === '/' ? `/${f.name}` : `${parentDirPath}/${f.name}`
  })
  return filePaths
}
