# Sqam

Sqam – Community-driven Transaction Insights to flight back the scam. Comes with a handy Metamask Snap.

## How it's built

Community members can flag (by emitting a Sqam record) deceptive websites and/or onchain addresses via [Sqam registry](./packages/contracts/src/Sqam.sol) contract with almost-free fast transactions on Gnosis.

Those flags are collected by our thegraph custom subgraph and are available to be consumed by the Metamask Snap (and other protocol integrations).

Sqam Records either "approve" or "reject" a web2 domain or an onchain address.

Our Snap calculates credibility of both approving and rejecting members to make an education decision about the score of the transaction. Credibility is calculated based on data fetched from Airstack.

Sqam uses a stateless smart-contract to allow for even lower gas fees.

Contracts:
- foundry (+openzeppelin) to develop stateless smart contract
- deployed to [Gnosis](./packages/contracts/broadcast/Sqam.s.sol/100/run-latest.json) (mainnet) + sepolia (testnet) via CREATE2

Web:
- vite + react + @chakra-ui
- [WalletConnect](./apps/webapp/src/web3/wallet.ts) + wagmi + viem

Other:
- [Metamask Snap using mm snaps repo](./mm-snaps/packages/examples/packages/transaction-insights/src/index.ts)
- [thegraph custom subgraph](./apps/graph/sqam-testnet-v4/schema.graphql) that indexes our contract
- number of [AirStack queries](./packages/libs/src/queries.ts) for on-chain reputation calculation

## Bootstrap

```sh
# first make sure you have foundry in place
curl -L https://foundry.paradigm.xyz | bash

# then install deps
yarn

# initialize env
cp .env.dev .env
# set the values (WC_PROJECT_ID, etc)
# and apply
source .env

# build core packages
yarn build

# build and run snap
cd mm-snaps && yarn && yarn dev

# in another terminal session run the web frontend
yarn dev
```

## Snap

We've been using [this build](https://github.com/MetaMask/metamask-extension/pull/21017#issuecomment-1732395408) of the Metamask Flask to test the snap.

Update [SNAP_ORIGIN](https://github.com/yabalaban/ethglobal-nyc/blob/496c073656bff47bbfd1b37bd0c075d1a7a75f52/apps/webapp/src/utils/snap.ts#L4) if you are serving a snap not on 8018 port.

## ETHGlobal NYC

The project has been created during the [ETHGlobal New York](https://ethglobal.com/events/newyork2023)

[Showcase](https://ethglobal.com/showcase/sqam-insights-7a0xm)

