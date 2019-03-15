const eitherIncludes = (str1, str2) => {
  return Boolean(str1 && str2 && (str1.includes(str2) || str2.includes(str1)))
}

module.exports = {
  eitherIncludes
}
