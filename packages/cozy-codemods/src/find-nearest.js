const findNearest = (path, condition) => {
  while (path && !condition(path) && path.parentPath) {
    path = path.parentPath
  }
  return path
}

module.exports = findNearest
