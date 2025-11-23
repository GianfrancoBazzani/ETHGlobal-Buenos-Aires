// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {IPool} from "@aave/core-v3/contracts/interfaces/IPool.sol";
import {IBaseAdapter} from "../interfaces/IBaseAdapter.sol";

contract AaveAdapter is IBaseAdapter {
    IPool public immutable market;
    address public immutable core;

    error Unauthorized();

    constructor(address _market, address _core) {
        market = IPool(_market);
        core = _core;
    }

    modifier onlyCore() {
        require(msg.sender == core, Unauthorized());
        _;
    }

    function extractLiquidity(address asset, uint256 amount, bytes memory, address destinationAdapter)
        external
        onlyCore
    {
        market.withdraw(asset, amount, destinationAdapter);
    }

    function allocateLiquidity(address asset, uint256 amount, bytes memory, address liquidityMigrator)
        external
        onlyCore
    {
        market.supply(asset, amount, liquidityMigrator, 0);
    }
}
