#!/bin/bash
bin="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $bin
./prepublish.sh
cd ..
echo "> publish misty"
npm publish
cd $bin
./publishall.sh
./prepublish.sh
cd ..
echo "> republish misty"
npm publish
cd $bin
./postpublish.sh
echo "> commit git"
./commit.sh
