# ETHGlobal Buenos Aires 2025 - bleeth.me

Protocol that allows the creation of liquidity vampire attack on other protocols by incentivizing users with rewards if they migrate from a victim protocol to an attacker one. In exchange, users have to lock their liquidity for a certain period of time in order to obtain liquidity provision that cannot be considered mercenary liquidity.

## Protocol Specification

### Protocol Time Windows

Anyone can create a vampire attack pool specifying the VA Pool configuration parameters.

Protocol steps:
 - VA Pool creation.
 - Betting period.
 - Liquidity migration.
 - Liquidity locking period.
 - Rewards distribution.

### Vampire Attack Pool

Configuration parameters:
 - Attacker protocol (address of bleeth.me router for the specific protocol).
 - Victim protocol (address of bleeth.me router for the specific protocol).
 - Tokens list (tokens involved in the vampire attack).
 - Reward token list (tokens given as reward).
 - Penalization coeficient.
 - Auction time.
 - Liquidity migration time.
 - Lock time.

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

### Incentives

Liquidity searchers: Actors that see value on migrate and lock liquidity.

Liquidity Pro: Actors that held liquidity.

### Rewards Distribution

The rewards are distributed using a rewards Synthetix like rewards distribution algorithm.

## Contracts

### bleeth.me core

Singleton contract that handles the VA Pools and the betting and rewards distribution logic.

### bleeth.me Routers

Interfaces with protocols, held the locked liquidity and allows the users to manage the liquidity.