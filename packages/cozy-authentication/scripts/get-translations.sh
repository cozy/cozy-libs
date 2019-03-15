#!/bin/sh

set -euxo pipefail

DRIVE_DIR=$1
JQ_REQ='{ onboarding: .mobile.onboarding } + { revoked: .mobile.revoked } | { mobile:  . }'

cat $DRIVE_DIR/locales/en.json | jq "$JQ_REQ" > src/locales/en.json
cat $DRIVE_DIR/locales/fr.json | jq "$JQ_REQ" > src/locales/fr.json
