# bleeth.me - ETHGlobal Buenos Aires 2025


![Bleeth Logo](./bleeth-frontend/public/bleeth-02.gif)

Bleeth.me is a cornerstone protocol that systematizes the DeFi liquidity wars while enabling DeFi protocols to reduce their reliance on mercenary liquidity. Its core mechanic is built around Vampire Attack (VA) Pools. A VA Pool can be created permissionlessly by anyone to initiate a deliberately targeted liquidity-stealing attack against a competitor protocol. Additionally, to protect against mercenary liquidity, a configurable lockup period can be specified to ensure that the funds remain deposited as liquidity in the destination protocol for a predetermined amount of time.


## Protocol Specification

### Protocol Time Windows

Anyone can create a vampire attack pool specifying the VA Pool configuration parameters.

Protocol steps:
 - VA Pool creation.
 - Betting period.
 - Liquidity migration period.
 - Liquidity locking period.
 - Rewards distribution.

### Vampire Attack Pool

Configuration parameters:
 - Attacker protocol (address of bleeth.me router for the specific protocol).
 - Victim protocol (address of bleeth.me router for the specific protocol).
 - Reward token list (tokens given as reward).
 - Penalization coeficient.
 - Auction time.
 - Liquidity migration time.
 - Lock time.
 - Snapshot lookup time.

### Betting

When an attack is created the direction is not specified yet meaning that attacker and victim protocols are specified but origin and destination of the funds are still pending do be defined. The resolution of the bet defines the direction of the attack. The bet allows to the users to bet 'for' or 'against' depositing reward token, the bet outcome is determined by the direction with higher value deposited.

Possible outcomes:
 - 'for':
    - attacker becomes destination
    - victim becomes origin
 - 'against':
    - attacker becomes origin
    - victim becomes destination

The funds on the winning side will be used to be payed as rewards to the users that participate in the liquidity migration.
The funds on the losing side will be returned to the loser betters minus a penalization that will be accounted to the winning side. 

### Auction Resolution Front Run Protection

In order to protect from last minute bets that can change the outcome the betting we modify the bet finalization time using Pyth Entropy.

### Incentives

Liquidity searchers: Actors that see value on migrate and lock liquidity.

Liquidity Pro: Actors that held liquidity.

### Rewards Distribution

Rewards are distributed during liquidity locking period only to users that use the migrated liquidity in the destination protocol using a rewards Synthetix like rewards distribution algorithm.

## Contracts

### bleeth.me core

Singleton contract that handles the VA Pools and the betting and rewards distribution logic.

### bleeth.me Adapters

Adapters with protocols, held the locked liquidity and allows the users to manage the liquidity.


## Project commands

### Run tests

`pnpm hardhat test contracts/tests/BleethMeCore.t.sol`