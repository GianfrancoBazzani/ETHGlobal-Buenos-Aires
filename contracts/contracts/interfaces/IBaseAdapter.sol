// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

interface IBaseAdapter {
    function extractLiquidity(address asset, uint256 amount, bytes memory protocolData, address destinationAdapter)
        external;

    function allocateLiquidity(address asset, uint256 amount, bytes memory allocationData, address liquidityMigrator)
        external;
}
