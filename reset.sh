#!/bin/bash
BASEDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

ROOTDIR=$BASEDIR/..

MODULES=(
  node-bifrost
  node-dwarfs
  node-heimdallr 
  node-mystique
  node-utils
  node-yggdrasil
)

echo ""
echo "Misty modules reset"
echo ""

# secs=$((30))
# while [ $secs -gt 0 ]; do
#   echo -ne "start in $secs seconds\033[0K\r"
#   sleep 1
#   : $((secs--))
# done

COUNT=1
TOTAL=$(expr ${#MODULES[@]} + 2)

echo -ne "($COUNT/$TOTAL)\twaiting for new package ... "
sleep 30
echo "[OK]"

for MODULE in ${MODULES[@]}; do
  COUNT=$(expr $COUNT + 1)
  echo -ne "($COUNT/$TOTAL)\t$MODULE ... "
  cd $ROOTDIR/$MODULE
  rm -rf node-modules yarn.lock package-lock.json
  yarn &> /dev/null &
  cd $ROOTDIR
  echo "[OK]"
done

COUNT=$(expr $COUNT + 1)
echo -ne "($COUNT/$TOTAL)\tinstalling modules ... "
sleep 30
echo "[OK]"

echo ""
echo "done!"
echo ""
