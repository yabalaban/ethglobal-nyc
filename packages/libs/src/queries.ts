import { ACCEPTED_TOKENS, GRAPH_QUERY_URL } from './constants';

const AIRSTACK_ENDPOINT = 'https://api.airstack.xyz/gql';
const AIRSTACK_KEY = 'c017255cba7c4e199917a94addfdb682';

const DomainReportersQuery = `query DomainReportersQuery($domainHash: String!) {
  reportedDomains(domainHash: $domainHash) {
    id
    domainHash
    good
    reporter
  }
}`;

const RecipientReportersQuery = `query RecipientReportersQuery($reported: String!) {
  reportedAddresses(reported: $reported) {
    id
    reported
    reporter
    blockNumber
  }
}`;

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
}`;

const MyReportedAddressesQuery = `query MyReportedAddressesQuery($reporter: String!) {
  reportedAddresses(reporter: $reporter) {
    id
    reported
    reporter
    blockNumber
  }
}`;

const MyReportedDomainsQuery = `query MyReportedDomainsQuery($reporter: String!) {
  reportedDomains(reporter: $reporter) {
    id
    domainHash
    good
    reporter
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
    reported.push(reportedDomain.domainHash);
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

export async function GetBalances(owners: string[]): Promise<number[]> {
  const data = await fetchAirstackQuery(TokenBalancesQuery, {
    owners: owners,
    tokenAddress: Object.keys(ACCEPTED_TOKENS),
  });
  return data.TokenBalances.TokenBalance.map(function (b: any) {
    return b.formattedAmount;
  });
}

async function fetchAirstackQuery(query: string, variables: Record<string, any>) {
  const results = await fetch(AIRSTACK_ENDPOINT, {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json',
      Authorization: AIRSTACK_KEY,
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