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

const ProfilesQuery = `query Query($owners: [Identity!], $resolved: [Address!], $tokenAddress: [Address!]) {
  TokenBalances(
    input: {filter: {owner: {_in: $owners}, tokenAddress: {_in: $tokenAddress}}, blockchain: ethereum}
  ) {
    TokenBalance {
      formattedAmount
      tokenAddress
    }
  }
  Poaps(input: {filter: {owner: {_in: $owners}}, blockchain: ALL, limit: 100}) {
    Poap {
      id
    }
  }
  Socials(input: {filter: {identity: {_in: $owners}}, blockchain: ethereum}) {
    Social {
      id
    }
  }
  SocialFollowers(input: {filter: {identity: {_in: $owners}}, blockchain: ALL}) {
    Follower {
      id
    }
  }
  Domains(
    input: {filter: {resolvedAddress: {_in: $resolved}, isPrimary: {_eq: true}}, blockchain: ethereum}
  ) {
    Domain {
      name
      resolvedAddress
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

function GetTokenTypeTotal(balanceDict: Map<string, number>, keys: string[], tokenBalance: any): number {
  if (!tokenBalance) {
    return 0.0;
  }
  let wrapped = 0; 
  keys.forEach(function (address) {
    wrapped += balanceDict.get(address.toLowerCase()) ?? 0.0;
  }); 
  return wrapped;
}

export async function GetBalances(owners: string[]): Promise<any[]> {
  if (owners.length == 0) {
    return [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, []];
  }

  const tokens = Object.keys(WRAPPED_ETH).concat(Object.keys(STABLE_COINS), Object.keys(DAO_TOKENS));
  const data = await fetchAirstackQuery(ProfilesQuery, {owners: owners, resolved: owners, tokenAddress: tokens});
  
  const balance: [string, number][] = data.TokenBalances.TokenBalance?.map(function(b: any, i: any) {
    return [b.tokenAddress, +b.formattedAmount];
  }) ?? [];
  const balanceDict = new Map<string, number>();
  for (const pair of balance) {
    balanceDict.set(pair[0], pair[1]);
  }
  const wrappedEth = GetTokenTypeTotal(balanceDict, Object.keys(WRAPPED_ETH), balanceDict);
  const stableCoins = GetTokenTypeTotal(balanceDict, Object.keys(STABLE_COINS), balanceDict);
  const daoTokens = GetTokenTypeTotal(balanceDict, Object.keys(DAO_TOKENS), balanceDict);
  const poaps = data.Poaps.Poap?.length ?? 0.0;
  const socials = (data.Socials.Social?.length ?? 0.0) * 1.0 / owners.length;
  const followers = data.SocialFollowers?.Follower?.length ?? 0.0;
  const domains = data.Domains?.Domain ?? [];
  const domainsDict = new Map<string, string>();
  for (const pair of domains) {
    domainsDict.set(pair.resolvedAddress, pair.name);
  }
  const confirmedBy = new Set<string>();
  for (const address of owners) {
    confirmedBy.add(domainsDict.get(address) ?? address);
  }
  return [wrappedEth, stableCoins, daoTokens, poaps, socials, followers, confirmedBy]
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