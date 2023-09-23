import type { OnTransactionHandler } from '@metamask/snaps-types';
import { panel, text } from '@metamask/snaps-ui';
import { init } from "@airstack/node";

export const AIRSTACK_ENDPOINT = 'https://api.airstack.xyz/gql';
export const AIRSTACK_KEY = 'c017255cba7c4e199917a94addfdb682';

export const AcceptedTokens = {
    "0xdAC17F958D2ee523a2206206994597C13D831ec7": "USDT",
    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48": "USDC",
};

export const Query = `query Query($owners: [Identity!], $tokenAddress: [Address!]) {
  TokenBalances(
    input: {filter: {owner: {_in: $owners}, tokenAddress: {_in: $tokenAddress}}, blockchain: ethereum}
  )
  {
    TokenBalance {
      amount
      tokenAddress
    }
  }
}`

async function fetchQuery(query: string, variables: Record<string, any>) {
  let results = await fetch(AIRSTACK_ENDPOINT, {
    method: 'POST',

    headers: {
      "Content-Type": "application/json",
      "Authorization": "c017255cba7c4e199917a94addfdb682"
    },

    body: JSON.stringify({
      query,
      variables,
    }),
  })
  let characters = await results.json();
  return characters.data
}

export async function GetScoring(addresses: string[]): Promise<string | undefined> {
    const data = await fetchQuery(Query, {owners: addresses, tokenAddress: Object.keys(AcceptedTokens)});
    console.log(JSON.stringify(data));
    return JSON.stringify(data);
}

export const onTransaction: OnTransactionHandler = async ({ transaction, transactionOrigin }) => {
  // 1. [Snap] hash origin
  // 2. [Subgraph] query reporter addresses per recipient and origin
  // 3. [Airstack] reporter stats
  // 4. [Snap] local scoring 
  // 5. [Snap] insight (severe or normal) based on the score
  const data = await GetScoring(["yabalaban.eth"]);
  return { content: panel([text(`**Transaction type: ${data} **`)]) };
};

// GetScoring(["yabalaban.eth"]);