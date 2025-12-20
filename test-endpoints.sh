#!/bin/bash

echo "Testing XandScan pNode Endpoints"
echo "=================================="
echo ""

working=0
failed=0
timeout=0

# Port 9001 endpoints (28 endpoints)
port9001_endpoints=(
    "173.212.207.32"
    "152.53.236.91"
    "62.171.138.27"
    "89.123.115.81"
    "45.151.122.77"
    "161.97.185.116"
    "192.190.136.28"
    "89.123.115.79"
    "154.38.171.140"
    "154.38.170.117"
    "152.53.155.15"
    "45.151.122.60"
    "173.249.3.118"
    "216.234.134.5"
    "161.97.97.41"
    "62.171.135.107"
    "173.212.220.65"
    "192.190.136.38"
    "207.244.255.1"
    "192.190.136.36"
    "45.84.138.15"
    "84.21.171.129"
    "154.38.169.212"
    "154.38.185.152"
    "173.249.59.66"
    "192.190.136.29"
    "173.249.54.191"
    "45.151.122.71"
)

# Port 6000 endpoints (9 endpoints)
port6000_endpoints=(
    "173.212.203.145"
    "173.212.220.65"
    "161.97.97.41"
    "192.190.136.36"
    "192.190.136.37"
    "192.190.136.38"
    "192.190.136.28"
    "192.190.136.29"
    "207.244.255.1"
)

echo "Testing Port 9001 Endpoints (28 total)"
echo "---------------------------------------"
for ip in "${port9001_endpoints[@]}"; do
    response=$(curl -s -m 3 "http://localhost:3000/api/prpc?endpoint=http://$ip:9001/rpc" \
        -X POST \
        -H "Content-Type: application/json" \
        -d '{"jsonrpc":"2.0","id":1,"method":"get-stats"}' 2>&1)

    if echo "$response" | grep -q '"result"'; then
        echo "[OK] $ip:9001 - WORKING"
        ((working++))
    elif echo "$response" | grep -q 'timeout'; then
        echo "[TIMEOUT] $ip:9001 - TIMEOUT"
        ((timeout++))
    else
        echo "[FAILED] $ip:9001 - FAILED"
        ((failed++))
    fi
done

echo ""
echo "Testing Port 6000 Endpoints (9 total)"
echo "--------------------------------------"
for ip in "${port6000_endpoints[@]}"; do
    response=$(curl -s -m 3 "http://localhost:3000/api/prpc?endpoint=http://$ip:6000/rpc" \
        -X POST \
        -H "Content-Type: application/json" \
        -d '{"jsonrpc":"2.0","id":1,"method":"get-stats"}' 2>&1)

    if echo "$response" | grep -q '"result"'; then
        echo "[OK] $ip:6000 - WORKING"
        ((working++))
    elif echo "$response" | grep -q 'timeout'; then
        echo "[TIMEOUT] $ip:6000 - TIMEOUT"
        ((timeout++))
    else
        echo "[FAILED] $ip:6000 - FAILED"
        ((failed++))
    fi
done

echo ""
echo "Summary"
echo "======="
echo "Total Endpoints: 37"
echo "Working: $working"
echo "Timeouts: $timeout"
echo "Failed: $failed"
echo ""

if [ $working -gt 0 ]; then
    echo "[SUCCESS] pNode implementation is WORKING with $working responding endpoints"
    exit 0
else
    echo "[ERROR] No endpoints responding - check network/configuration"
    exit 1
fi
