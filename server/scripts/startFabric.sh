#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#
# Exit on first error
set -e

# don't rewrite paths for Windows Git Bash users
export MSYS_NO_PATHCONV=1
starttime=$(date +%s)


# clean out any old identites in the wallets
rm -rf wallet/*

# CC_SRC_PATH="../chaincode/"
CC_SRC_PATH="../../server/chaincode/"

# launch network; create channel and join peer to channel
pushd ../../fabric-samples/test-network
./network.sh down
./network.sh up createChannel -ca -s couchdb
./network.sh deployCC -ccn medicalContract -cci initLedger -ccl javascript -ccp ${CC_SRC_PATH}
popd

cat <<EOF

Total setup execution time : $(($(date +%s) - starttime)) secs ...

EOF
