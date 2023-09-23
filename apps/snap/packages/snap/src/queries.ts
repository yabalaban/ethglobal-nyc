import { DAO_HARDCODED_SUPPLY, DAO_TOKENS, GRAPH_QUERY_URL, STABLE_COINS, WRAPPED_ETH } from "./constants";

const AIRSTACK_ENDPOINT = 'https://api.airstack.xyz/gql';
const AIRSTACK_KEY = 'c017255cba7c4e199917a94addfdb682';


const DomainReportersQuery = `query DomainReportersQuery($domainHash: String!) {
  reportedDomains(domainHash: $domainHash) {
    id
    domainHash
    good
    reporter
  }
}`

const RecipientReportersQuery = `query RecipientReportersQuery($reported: String!) {
  reportedAddresses(reported: $reported) {
    id
    reported
    reporter
    blockNumber
  }
}`

const TokenBalancesQuery = `query Query($owners: [Identity!], $tokenAddress: [Address!]) {
    TokenBalances(
      input: {filter: {owner: {_in: $owners}, tokenAddress: {_in: $tokenAddress}}, blockchain: ethereum}
    )
    {
      TokenBalance {
        formattedAmount
        tokenAddress
      }
    }
  }`
  
  
export async function GetDomainReporters(domainHash: string): Promise<[string, boolean][]> {
  let results = await fetchGraphQuery(DomainReportersQuery, {domainHash: domainHash});
  var reporters: [string, boolean][] = [];
  results.reportedDomains.forEach((reportedDomain: any) => {
    reporters.push([reportedDomain.reporter, reportedDomain.good])
  });
  return reporters;
}


export async function GetRecipientReporters(reported: string): Promise<string[]> {
  let results = await fetchGraphQuery(RecipientReportersQuery, {reported: reported});
  var reporters: string[] = [];
  results.reportedAddresses.forEach((reportedDomain: any) => {
    reporters.push(reportedDomain.reporter)
  });
  return reporters;
}

export async function GetBalances(owners: string[]): Promise<number[]> {
  if (owners.length == 0) {
    return [0.0, 0.0, 0.0];
  }

  const tokens = Object.keys(WRAPPED_ETH).concat(Object.keys(STABLE_COINS), Object.keys(DAO_TOKENS));
  const data = await fetchAirstackQuery(TokenBalancesQuery, {owners: owners, tokenAddress: tokens});
  
  const balance: [string, number][] = data.TokenBalances.TokenBalance.map(function(b: any, i: any) {
    return [b.tokenAddress, +b.formattedAmount];
  });
  const balanceDict = new Map<string, number>();
  for (let pair of balance) {
    balanceDict.set(pair[0], pair[1]);
  }
  let wrappedEthTotal = 0; 
  Object.keys(WRAPPED_ETH).forEach(function (address) {
    wrappedEthTotal += balanceDict.get(address.toLowerCase()) ?? 0.0;
  }); 
  let stableCoinsTotal = 0; 
  Object.keys(STABLE_COINS).forEach(function (address) {
    stableCoinsTotal += balanceDict.get(address.toLowerCase()) ?? 0.0;
  }); 
  let daoTotal = 0; 
  Object.keys(DAO_TOKENS).forEach(function (address) {
    daoTotal += ((balanceDict.get(address.toLowerCase()) ?? 0.0)/ (DAO_HARDCODED_SUPPLY.get(address) ?? 1.0));
  }); 
  return [wrappedEthTotal, stableCoinsTotal, daoTotal]
}

async function fetchAirstackQuery(query: string, variables: Record<string, any>) {
    let results = await fetch(AIRSTACK_ENDPOINT, {
        method: 'POST',

        headers: {
        "Content-Type": "application/json",
        "Authorization": AIRSTACK_KEY
        },

        body: JSON.stringify({
        query,
        variables,
        }),
    })
    let characters = await results.json();
    return characters.data
}

async function fetchGraphQuery(query: string, variables: Record<string, any>) {
  let body = JSON.stringify({
    query,
    variables
    });
    let results = await fetch(GRAPH_QUERY_URL, {
        method: 'POST',

        headers: {
        "Content-Type": "application/json",
        },

        body: JSON.stringify({
        query,
        variables
        }),
    })
    let characters = await results.json();
    return characters.data
}