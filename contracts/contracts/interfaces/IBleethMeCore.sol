// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {IBaseAdapter} from "./IBaseAdapter.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IBleethMeCore {
    enum VAPoolState {
        UNINITIALIZED,
        BETTING,
        MIGRATION,
        LOCKING,
        WITHDRAWAL
    }

    enum BetSide {
        FOR,
        AGAINST
    }

    struct Bet {
        BetSide side;
        IERC20 token;
        uint256 amount;
        uint256 timestamp;
    }

    event VAPoolCreated(uint256 indexed vaPoolId, address indexed attacker, address indexed victim);
    event BetPlaced(bytes32 indexed poolId, address indexed user);
    event RewardTokenWhitelisted(address indexed token, bytes32 indexed priceFeedId);
    event WithdrawFailedBet(address indexed user, address indexed token, uint256 indexed amount);
    event RewardsClaimed(address indexed user);
    event BettingFinalized(uint256 indexed vaPoolId);
    event LiquidityPositionDeconstructed(uint256 indexed vaPoolId, address indexed token, uint256 indexed amount, address user);
    event LiquidityPositionAllocated(uint256 indexed vaPoolId, address indexed token, uint256 indexed amount, address user);
    event PositionsMerkleRootUpdated(uint256 indexed vaPoolId, bytes32 indexed merkleRoot);

    error InvalidPenalization();
    error RewardTokenNotWhitelisted();
    error InsufficientBetAmount();
    error InvalidState();
    error BettingPeriodClosed();
    error BettingPeriodNotFinalized();
    error AuctionNotFinalized();
    error PositionMerkleTreeNotSet();
    error InvalidPositionVerification();
    error NotEnoughLiquidityExtracted();
    error InvalidWithdrawal();
    error BetAlreadyPlaced();

    function createVaPool(
        IBaseAdapter attacker,
        IBaseAdapter victim,
        IERC20[] calldata rewardTokens,
        uint256 penalizationCoefficient,
        uint256 auctionDuration,
        uint256 liquidityMigrationDelay,
        uint256 lockDuration,
        uint256 snapshotLookupTime,
        IERC20 initialBetToken,
        uint256 initialBetAmount
    ) external returns (uint256 vaPoolId);

    function placeBet(uint256 vaPoolId, BetSide side, IERC20 token, uint256 amount) external;

    function withdrawFailedBet(uint256 vaPoolId) external;

    function claimRewards(uint256 vaPoolId) external;

    function finalizeBetting(uint256 vaPoolId, bytes[] calldata priceUpdate) external payable;

    function deconstructLiquidityPosition(uint256 vaPoolId, address tokenToMigrate, uint256 amountToMigrate, bytes memory extractionData, bytes32[] memory proofs) external;

    function allocateLiquidityPosition(uint256 vaPoolId, address tokenToMigrate, uint256 amountToAllocate, bytes memory migrationData) external;

    function getBet(uint256 vaPoolId, address better) external view returns (Bet memory);

    function getWhitelistedRewardTokens() external view returns (address[] memory);

    function getWhitelistedRewardTokenPriceFeedId(IERC20 token) external view returns (bytes32);

    // Admin Functions
    function setWhitelistRewardToken(IERC20 token, bytes32 priceFeedId) external;

    function updatePositionMerkleRoot(uint256 vaPoolId, bytes32 root) external;

}
