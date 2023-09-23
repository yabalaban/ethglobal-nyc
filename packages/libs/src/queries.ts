import { DAO_TOKENS, GRAPH_QUERY_URL, STABLE_COINS, WRAPPED_ETH } from './constants';

const AIRSTACK_ENDPOINT = 'https://api.airstack.xyz/gql';
const AIRSTACK_KEY1 = 'c017255cba7c4e199917a94addfdb682';
const AIRSTACK_KEY2 = '78ef9a257fb84cce82b8f79d0ce3074a';
const AIRSTACK_KEY3 = '66088c30365146f1924825296523671b';
const AIRSTACK_KEYS = [AIRSTACK_KEY1, AIRSTACK_KEY2, AIRSTACK_KEY3];

const DomainReportersQuery = `query DomainReportersQuery($domainHash: String!) {
  reportedDomains(where: {domainHash: $domainHash}) {
    id
    domainHash
    domain
    good
    reporter
  }
}`;

const RecipientReportersQuery = `query RecipientReportersQuery($reported: String!) {
  reportedAddresses(where: {reported: $reported}) {
    id
    reported
    reporter
    blockNumber
  }
}`;

const ProfilesQuery = `query Query($owners: [Identity!], $tokenAddress: [Address!], $resolved: [Address!]) {
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
}`;

const MyReportedAddressesQuery = `query MyReportedAddressesQuery($reporter: String!) {
  reportedAddresses(where: {reporter: $reporter}) {
    id
    reported
    reporter
    blockNumber
  }
}`;

const MyReportedDomainsQuery = `query MyReportedDomainsQuery($reporter: String!) {
  reportedDomains(where: {reporter: $reporter}) {
    id
    domainHash
    domain
    good
    reporter
  }
}`;

const ENSDomainsQuery = `query ENSDomains($resolved: [Address!]) {
  Domains(input: {filter: {resolvedAddress: {_in: $resolved}, isPrimary: {_eq:true}}, blockchain: ethereum}) {
    Domain {
      name
      resolvedAddress
    }
  }
}`;

export async function GetMyReportedAddresses(reporter: string): Promise<string[]> {
  const results = await fetchGraphQuery(MyReportedAddressesQuery, { reporter: reporter });
  const reported: string[] = [];
  results.reportedAddresses.forEach((reportedAddress: any) => {
    reported.push(reportedAddress.reported);
  });
  return reported;
}

export async function GetMyReportedDomains(reporter: string): Promise<string[]> {
  const results = await fetchGraphQuery(MyReportedDomainsQuery, { reporter: reporter });
  const reported: string[] = [];
  results.reportedDomains.forEach((reportedDomain: any) => {
    reported.push(reportedDomain.domain);
  });
  return reported;
}

export async function GetDomainReporters(domainHash: string): Promise<[string, boolean][]> {
  const results = await fetchGraphQuery(DomainReportersQuery, { domainHash: domainHash });
  const reporters: [string, boolean][] = [];
  results.reportedDomains.forEach((reportedDomain: any) => {
    reporters.push([reportedDomain.reporter, reportedDomain.good]);
  });
  return reporters;
}

export async function GetRecipientReporters(reported: string): Promise<string[]> {
  const results = await fetchGraphQuery(RecipientReportersQuery, { reported: reported });
  const reporters: string[] = [];
  results.reportedAddresses.forEach((reportedDomain: any) => {
    reporters.push(reportedDomain.reporter);
  });
  return reporters;
}

function GetTokenTypeTotal(
  balanceDict: Map<string, number>,
  keys: string[],
  tokenBalance: any,
): number {
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
  if (owners.length === 0) {
    return [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, new Set([])];
  }

  const tokens = Object.keys(WRAPPED_ETH).concat(
    Object.keys(STABLE_COINS),
    Object.keys(DAO_TOKENS),
  );
  const data = await fetchAirstackQuery(ProfilesQuery, {
    owners,
    resolved: owners,
    tokenAddress: tokens,
  });

  const balance: [string, number][] =
    data.TokenBalances.TokenBalance?.map((b: any) => [b.tokenAddress, +b.formattedAmount]) ?? [];
  const balanceDict = new Map<string, number>();
  for (const pair of balance) {
    balanceDict.set(pair[0], pair[1]);
  }
  const wrappedEth = GetTokenTypeTotal(balanceDict, Object.keys(WRAPPED_ETH), balanceDict);
  const stableCoins = GetTokenTypeTotal(balanceDict, Object.keys(STABLE_COINS), balanceDict);
  const daoTokens = GetTokenTypeTotal(balanceDict, Object.keys(DAO_TOKENS), balanceDict);
  const poaps = data.Poaps.Poap?.length ?? 0.0;
  const socials = ((data.Socials.Social?.length ?? 0.0) * 1.0) / owners.length;
  const followers = data.SocialFollowers?.Follower?.length ?? 0.0;
  const domains = data.Domains?.Domain ?? [];
  const domainsDict = new Map<string, string>();
  for (const pair of domains) {
    domainsDict.set(pair.resolvedAddress, pair.name);
  }
  const confirmedBy = new Set<string>();
  for (const address of owners) {
    if (domainsDict.get(address)) {
      confirmedBy.add(domainsDict.get(address)!);
    }
  }
  return [wrappedEth, stableCoins, daoTokens, poaps, socials, followers, confirmedBy];
}

export async function GetENSDomains(resolvedAddresses: string[]): Promise<Record<string, string>> {
  const data = await fetchAirstackQuery(ENSDomainsQuery, { resolved: resolvedAddresses });
  console.log(data.Domains);
  return (
    data.Domains.Domain?.reduce((map: Record<string, string>, obj: any) => {
      map[obj.resolvedAddress] = obj.name;
      return map;
    }, {}) ?? {}
  );
}

let currentKey = 0;
const getAirstackKey = () => {
  const key = AIRSTACK_KEYS[currentKey % AIRSTACK_KEYS.length];
  currentKey += 1;
  return key;
};

async function fetchAirstackQuery(query: string, variables: Record<string, any>) {
  const results = await fetch(AIRSTACK_ENDPOINT, {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json',
      Authorization: getAirstackKey(),
    },

    body: JSON.stringify({
      query,
      variables,
    }),
  });
  const characters = await results.json();
  return characters.data;
}

async function fetchGraphQuery(query: string, variables: Record<string, any>) {
  const results = await fetch(GRAPH_QUERY_URL, {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json',
    },

    body: JSON.stringify({
      query,
      variables,
    }),
  });
  const characters = await results.json();
  return characters.data;
}
