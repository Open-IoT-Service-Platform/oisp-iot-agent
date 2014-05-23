l#!/bin/bash


echo ""
echo "============================================"
echo "IoT Kit Agent" 
echo "============================================"

# reset logs directory
if [ -f agent.log ] || [ -f forever.log ]; then
   rm *.log
fi

export BASE_DIR="${PWD}"
FOREVER=${BASE_DIR}/node_modules/.bin/forever

${FOREVER} start -m 1 \
              -a -l "${BASE_DIR}/forever.log" \
              --sourceDir $BASE_DIR \
              --minUptime 1s \
              --spinSleepTime 3s agent.js


echo ""
echo "Device Id:" 
node admin device-id
echo ""
echo "============================================"

   

