#!/bin/bash

# Assert we are on the root folder
if [ ! -d "contracts" ]; then 
	echo "error: script needs to be run from project root './tools/run-all.sh'"
	exit 1
fi

# Run slither analysis
./tools/slither/slither.sh > tools/logs/slither-output.log

# Run mythril analysis
./tools/mythril/mythril.sh > tools/logs/mythril-output.log

# Run manticore analysis
./tools/manticore/manticore.sh > tools/logs/manticore-output.log

# Run echidna analysis
./tools/echidna/echidna.sh > tools/logs/echidna-output.log