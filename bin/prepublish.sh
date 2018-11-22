#!/bin/bash
bin="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $bin/..
echo "> prepublish misty"
yarn upgrade
node ./node_modules/@supersoccer/semver/index.js
