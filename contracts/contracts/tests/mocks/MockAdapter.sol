// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {IBaseAdapter} from "../../interfaces/IBaseAdapter.sol";

contract MockAdapter is IBaseAdapter {
    address public immutable core;

    error Unauthorized();
    error AssetMismatch();

    constructor(address _core) {
        core = _core;
    }

    modifier onlyCore() {
        require(msg.sender == core, Unauthorized());
        _;
    }

    function extractLiquidity(address asset, uint256 amount, bytes memory protocolData, address destinationAdapter)
        external
        onlyCore
    {
        // TODO
    }

    function allocateLiquidity(address asset, uint256 amount, bytes memory allocationData, address liquidityMigrator)
        external
        onlyCore
    {
        // TODO
    }
}
