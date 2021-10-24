#!/bin/sh

PATH=$(npm bin):$PATH

exec node /app/index.js "$@"
