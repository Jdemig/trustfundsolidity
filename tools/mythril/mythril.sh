#!/bin/bash

# Assert we are in the right folder
if [ ! -d "contracts" ]; then 
	echo "error: script needs to be run from project root './tools/mythril/mythril.sh'"
	exit 1
fi

# Run mythril analyse on the given contract
function analyse_contract {
	docker run --rm -v `pwd`:/src  --workdir=/src mythril/myth -v 4 analyze $1 --solc-json tools/mythril/remapping.json --max-depth 50
}

echo ""
echo "<----- Checking SybelToken.sol ----->"
analyse_contract contracts/tokens/SybelToken.sol

echo ""
echo "<----- Checking VestingWallets.sol ----->"
analyse_contract contracts/wallets/VestingWallets.sol

echo ""
echo "<----- Checking SybelInternalTokens.sol ----->"
analyse_contract contracts/tokens/SybelInternalTokens.sol