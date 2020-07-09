const fromEntries = entries => {
  const res = {}
  for (let entry of entries) {
    res[entry[0]] = entry[1]
  }
  return res
}

const keyBy = (values, fn) => {
  return fromEntries(values.map(v => [fn(v), v]))
}

module.exports = {
  fromEntries,
  keyBy
}
