#!/bin/bash
bin="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $bin/..
git add .
git commit -m "prepublish auto commit"
git push origin master