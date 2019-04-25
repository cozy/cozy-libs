#!/bin/sh

export STATE=mystate
export SECRET=mysecret
export STACK_DOMAIN=cozy.tools:8080
export REDIRECT_URI=http://localhost:1234/auth
export SCOPE=io.cozy.files
export CLIENT_ID=$(cozy-stack instances client-oauth $STACK_DOMAIN "$REDIRECT_URI" example-app io.cozy.example --onboarding-app example --onboarding-permissions $SCOPE --onboarding-secret $SECRET --onboarding-state $STATE)

echo "http://cozy.tools:8080/auth/authorize?state=$STATE&client_id=$CLIENT_ID&secret=$SECRET&response_type=code&scope=$SCOPE&redirect_uri=$REDIRECT_URI"
