#!/usr/bin/env bash
url="http://localhost:8357"
total=0
max=10
while sleep 1
do
    total=$((total+1))
    if [ $total -gt $max ]; then
        echo "Timed out waiting for server to start. Run \`killall node\` and try again."
        break
    fi
    if curl --output /dev/null --silent --head --fail "$url"; then
        npm run sync-components
        break
    fi
done
