#!/bin/bash
bin="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

ROOTDIR=$bin/../..

echo "> publish misty-loader"
cd $ROOTDIR/node-misty-loader
npm publish