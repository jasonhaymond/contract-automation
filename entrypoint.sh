#!/bin/sh

if [ "$NODE_ENV" = "development" ]; then
    echo "DEVELOPMENT"
    ./node_modules/.bin/nodemon --inspect-brk=0.0.0.0:9229 ./src/app.js "$@"
else
    echo "PRODUCTION"
    node ./src/app.js "$@"
fi
