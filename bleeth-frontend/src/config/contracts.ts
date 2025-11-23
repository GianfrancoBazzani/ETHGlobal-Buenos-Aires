export const bleethMeCoreAbi = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "initialOwner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_entropy",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_pyth",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "AuctionNotFinalized",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "BetAlreadyPlaced",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "BettingPeriodClosed",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "BettingPeriodNotFinalized",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "key",
          "type": "bytes32"
        }
      ],
      "name": "EnumerableMapNonexistentKey",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InsufficientBetAmount",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InvalidPenalization",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InvalidPositionVerification",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InvalidState",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InvalidWithdrawal",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "NotEnoughLiquidityExtracted",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "OwnableInvalidOwner",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "OwnableUnauthorizedAccount",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "PositionMerkleTreeNotSet",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "RewardTokenNotWhitelisted",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "poolId",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        }
      ],
      "name": "BetPlaced",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "vaPoolId",
          "type": "uint256"
        }
      ],
      "name": "BettingFinalized",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "vaPoolId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "user",
          "type": "address"
        }
      ],
      "name": "LiquidityPositionAllocated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "vaPoolId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "user",
          "type": "address"
        }
      ],
      "name": "LiquidityPositionDeconstructed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "vaPoolId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "merkleRoot",
          "type": "bytes32"
        }
      ],
      "name": "PositionsMerkleRootUpdated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "priceFeedId",
          "type": "bytes32"
        }
      ],
      "name": "RewardTokenWhitelisted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        }
      ],
      "name": "RewardsClaimed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "vaPoolId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "attacker",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "victim",
          "type": "address"
        }
      ],
      "name": "VAPoolCreated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "WithdrawFailedBet",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint64",
          "name": "sequence",
          "type": "uint64"
        },
        {
          "internalType": "address",
          "name": "provider",
          "type": "address"
        },
        {
          "internalType": "bytes32",
          "name": "randomNumber",
          "type": "bytes32"
        }
      ],
      "name": "_entropyCallback",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "vaPoolId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "tokenToMigrate",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amountToAllocate",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "migrationData",
          "type": "bytes"
        }
      ],
      "name": "allocateLiquidityPosition",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "vaPoolId",
          "type": "uint256"
        }
      ],
      "name": "claimRewards",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "contract IBaseAdapter",
          "name": "attacker",
          "type": "address"
        },
        {
          "internalType": "contract IBaseAdapter",
          "name": "victim",
          "type": "address"
        },
        {
          "internalType": "contract IERC20[]",
          "name": "rewardTokens",
          "type": "address[]"
        },
        {
          "internalType": "uint256",
          "name": "penalizationCoefficient",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "auctionDuration",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "liquidityMigrationDelay",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "lockDuration",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "snapshotLookupTimestamp",
          "type": "uint256"
        },
        {
          "internalType": "contract IERC20",
          "name": "initialBetToken",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "initialBetAmount",
          "type": "uint256"
        }
      ],
      "name": "createVaPool",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "vaPoolId",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "vaPoolId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "tokenToMigrate",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amountToMigrate",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "extractionData",
          "type": "bytes"
        },
        {
          "internalType": "bytes32[]",
          "name": "proofs",
          "type": "bytes32[]"
        }
      ],
      "name": "deconstructLiquidityPosition",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "entropy",
      "outputs": [
        {
          "internalType": "contract IEntropyV2",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "vaPoolId",
          "type": "uint256"
        },
        {
          "internalType": "bytes[]",
          "name": "priceUpdate",
          "type": "bytes[]"
        }
      ],
      "name": "finalizeBetting",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "vaPoolId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "better",
          "type": "address"
        }
      ],
      "name": "getBet",
      "outputs": [
        {
          "components": [
            {
              "internalType": "enum IBleethMeCore.BetSide",
              "name": "side",
              "type": "uint8"
            },
            {
              "internalType": "contract IERC20",
              "name": "token",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "timestamp",
              "type": "uint256"
            }
          ],
          "internalType": "struct IBleethMeCore.Bet",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "int64",
              "name": "price",
              "type": "int64"
            },
            {
              "internalType": "uint64",
              "name": "conf",
              "type": "uint64"
            },
            {
              "internalType": "int32",
              "name": "expo",
              "type": "int32"
            },
            {
              "internalType": "uint256",
              "name": "publishTime",
              "type": "uint256"
            }
          ],
          "internalType": "struct PythStructs.Price",
          "name": "pythPrice",
          "type": "tuple"
        }
      ],
      "name": "getPythPrice",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "contract IERC20",
          "name": "token",
          "type": "address"
        }
      ],
      "name": "getWhitelistedRewardTokenPriceFeedId",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getWhitelistedRewardTokens",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "vaPoolId",
          "type": "uint256"
        },
        {
          "internalType": "enum IBleethMeCore.BetSide",
          "name": "side",
          "type": "uint8"
        },
        {
          "internalType": "contract IERC20",
          "name": "token",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "placeBet",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "pyth",
      "outputs": [
        {
          "internalType": "contract IPyth",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint64",
          "name": "sequenceNumber",
          "type": "uint64"
        }
      ],
      "name": "randomnessMapping",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "vaPoolId",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "contract IERC20",
          "name": "token",
          "type": "address"
        },
        {
          "internalType": "bytes32",
          "name": "priceFeedId",
          "type": "bytes32"
        }
      ],
      "name": "setWhitelistRewardToken",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "vaPoolId",
          "type": "uint256"
        },
        {
          "internalType": "bytes32",
          "name": "root",
          "type": "bytes32"
        }
      ],
      "name": "updatePositionMerkleRoot",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "vaPoolCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "vaPools",
      "outputs": [
        {
          "internalType": "contract IBaseAdapter",
          "name": "attacker",
          "type": "address"
        },
        {
          "internalType": "contract IBaseAdapter",
          "name": "victim",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "penalizationCoefficient",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "auctionEndTimestamp",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "liquidityMigrationTimestamp",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "lockTimestamp",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "snapshotLookupTimestamp",
          "type": "uint256"
        },
        {
          "internalType": "enum IBleethMeCore.VAPoolState",
          "name": "state",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "vaStreams",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "balancesMerkleRoot",
          "type": "bytes32"
        },
        {
          "internalType": "contract IBaseAdapter",
          "name": "liquidityOrigin",
          "type": "address"
        },
        {
          "internalType": "contract IBaseAdapter",
          "name": "liquidityDestination",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "totalRewards",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "totalLiquidityMigrated",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "vaPoolId",
          "type": "uint256"
        }
      ],
      "name": "withdrawFailedBet",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]
export const bleethMeCoreAddress = "0x32E3337321578c7ecE3AF13ba98aa70581a15203";