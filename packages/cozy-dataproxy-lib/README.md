# Cozy-dataproxy-lib

## Concept

This library is meant to be used by DataProxy apps like [cozy-web-data-proxy](https://github.com/cozy/cozy-web-data-proxy) or [cozy-flagship-app](https://github.com/cozy/cozy-flagship-app). Its goal is to mutualize data manipulation features like Search indexing

## Installation

Just run

- `yarn add cozy-dataproxy-lib`

## API

### Nomenclature

- `SearchEngine`: Class that can index and search through Cozy's metadata

### Setup and usage

In order to create a SearchEngine:

```ts
  const searchEngine = new SearchEngine(client)

  // ...

  const query = 'Some search string'
  const searchResult = searchEngine.search(query)
```
