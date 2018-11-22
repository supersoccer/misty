#!/bin/bash
bin="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

ROOTDIR=$bin/../..

MODULES=(
  node-bifrost
  node-dwarfs
  node-heimdallr 
  node-mystique
  node-utils
  node-yggdrasil
)

COUNT=0
TOTAL=$(expr ${#MODULES[@]})

echo "> publish all dependencies"

for MODULE in ${MODULES[@]}; do
  COUNT=$(expr $COUNT + 1)
  echo "($COUNT/$TOTAL) $MODULE"
  sleep 5
  cd $ROOTDIR/$MODULE
  npm publish
  # rm -rf node-modules yarn.lock package-lock.json
  # yarn &> /dev/null &
  cd $ROOTDIR
done

sleep 5
