#!/bin/bash

set -e

yarn lint
yarn lint:md -f
yarn build
yarn test


set +e # The following command relies on exit 1
git diff --exit-code -- '*.md'
docs_status=$?
set -e
if [[ $docs_status == 0 ]]; then
  echo "Docs are up-to-date"
else
  echo "Docs are not up-to-date, please run yarn lint:md -f and repush"
  exit 1
fi
set -e
