// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import { MarketParams, IMorphoBase } from "@morpho-org/morpho-blue/src/interfaces/IMorpho.sol";
import { IBaseAdapter } from "../interfaces/IBaseAdapter.sol";

contract MorphpAdapter is IBaseAdapter {

    address public immutable core;

    error Unauthorized();
    error AssetMismatch();

    constructor(address _core){
        core = _core;
    }

    modifier onlyCore{
        require(msg.sender == core, Unauthorized());
        _;
    }

    function extractLiquidity(
        address asset,
        uint256 amount,
        bytes memory protocolData,
        address destinationAdapter
    ) external onlyCore {
        (MarketParams memory dataParams, address market) = abi.decode(protocolData, (MarketParams, address));
        require(dataParams.collateralToken == asset, AssetMismatch());
        IMorphoBase(market).withdraw(dataParams, amount, 0, msg.sender, destinationAdapter);
    }

    function allocateLiquidity(
        address asset,
        uint256 amount,
        bytes memory allocationData,
        address liquidityMigrator
    ) external onlyCore {
        (MarketParams memory dataParams, address market) = abi.decode(allocationData, (MarketParams, address));
        require(dataParams.collateralToken == asset, AssetMismatch());
        bytes memory emptyData;
        IMorphoBase(market).supply(dataParams, amount, 0, liquidityMigrator, emptyData);
    }
}
