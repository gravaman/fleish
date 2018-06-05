#! /bin/bash

ENV_TYPE=$1
LOCAL_PORT=8080
SERVER_PATH="server/index.js"
TEST_PATH="server/tests/index.js"

if [[ "$ENV_TYPE" = "test" ]]
then
  START_PATH="$TEST_PATH"
elif [[ "$ENV_TYPE" = "dev" ]]
then
  START_PATH="$SERVER_PATH"
  NPM_CONFIG_PORT=$LOCAL_PORT
elif [[ "$ENV_TYPE" = "production" ]]
then
  START_PATH="$SERVER_PATH"
fi

echo "environment: $ENV_TYPE"
if [[ "$NPM_CONFIG_PORT" ]]
then
  echo "port: $NPM_CONFIG_PORT"
fi

node $START_PATH
