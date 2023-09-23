
import { init, fetchQuery } from "@airstack/node";

init("c017255cba7c4e199917a94addfdb682", "dev");

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

export async function GetScoring(addresses: string[]): Promise<string | undefined> {
    const { data } = await fetchQuery(Query, {owners: addresses, tokenAddress: Object.keys(AcceptedTokens)});
    // const tokens = data['TokenBalances']['TokenBalance'];
    return JSON.stringify(data);
}

// console.log(GetScoring(["yabalaban.eth"]));