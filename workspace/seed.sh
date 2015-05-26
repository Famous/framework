#!/usr/bin/env bash

npm run start-ecosystem &

url="http://localhost:8357"
ready=false
total=0
max=30

while sleep 1
do
    total=$((total+1))
    if [ $total -gt $max ]; then
        echo "Timed out waiting for server to start"
        break
    fi
    if curl --output /dev/null --silent --head --fail "$url"; then
        npm run sync-components
        break
    fi
done

killall node
