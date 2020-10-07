const findNearest = (pathArg, condition) => {
  let path = pathArg
  while (path && !condition(path) && path.parentPath) {
    path = path.parentPath
  }
  return path
}

module.exports = findNearest
