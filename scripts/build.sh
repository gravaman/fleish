#! /bin/bash

ENV_TYPE=$1
LOCAL_PORT=8080
SERVER_PATH="server/index.js"
TEST_PATH="server/tests/index.js"
WEBPACK_DEV_PATH="./webpack.config.js"
WEBPACK_PROD_PATH="./webpack.prod.config.js"

if [[ "$ENV_TYPE" = "test" ]]
then
  START_PATH="$TEST_PATH"
  WEBPACK_PATH="$WEBPACK_DEV_PATH"
elif [[ "$ENV_TYPE" = "dev" ]]
then
  START_PATH="$SERVER_PATH"
  WEBPACK_PATH="$WEBPACK_DEV_PATH"
  export PORT=$LOCAL_PORT
elif [[ "$ENV_TYPE" = "production" ]]
then
  START_PATH="$SERVER_PATH"
  WEBPACK_PATH="$WEBPACK_PROD_PATH"
  export NODE_ENV="production"
fi

echo "environment: $ENV_TYPE"
if [[ "$PORT" ]]
then
  echo "port: $PORT"
fi

if [[ "$ENV_TYPE" = "ui" ]]
then
  webpack-dev-server --open
elif [[ "$ENV_TYPE" = "production" ]]
then
  npx webpack --config $WEBPACK_PATH
else
  npx webpack --config $WEBPACK_PATH
  node $START_PATH
fi
