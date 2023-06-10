#!/bin/bash

# Assert we are in the right folder
if [ ! -d "contracts" ]; then 
	echo "error: script needs to be run from project root './tools/slither/slither.sh'"
	exit 1
fi

# Run mythril analyse on the given contract
function analyse_contract {
	docker run --rm -it -v `pwd`:/trustfundsolidity --workdir=/trustfundsolidity trailofbits/slither slither $1

	# docker run --rm -v `pwd`:/src  --workdir=/src mythril/myth -v 4 analyze $1 --solc-json tools/mythril/remapping.json --max-depth 50
}

echo ""
echo "<----- Checking ZedHeadNoodSuit.sol ----->"
analyse_contract contracts/ZedHeadNoodSuit.sol