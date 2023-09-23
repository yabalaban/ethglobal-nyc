import { OnRpcRequestHandler, OnTransactionHandler } from '@metamask/snaps-types';
import { panel, text, heading, copyable } from '@metamask/snaps-ui';
import { GetBalances, GetDomainReporters, GetRecipientReporters } from './queries';

const keccak256 = require('keccak256');

export const onTransaction: OnTransactionHandler = async ({ transaction, transactionOrigin }) => {
  const recipient = transaction.to as string; 
  const recipientReporters = await GetRecipientReporters(recipient);
  const reportersBalance = await GetBalances(recipientReporters);

  const domainHash = `0x${keccak256(transactionOrigin).toString('hex')}`;
  const domainReportes = await GetDomainReporters(domainHash);
  const domainGoodReporters = domainReportes.filter(function (el, i, arr) {
    return el[1] == true;
  });
  const domainBadReporters = domainReportes.filter(function (el, i, arr) {
    return el[1] == false;
  });
  
  const domainGoodBalances = await GetBalances(domainGoodReporters.map(x => x[0]));
  const domainBadBalances = await GetBalances(domainBadReporters.map(x => x[0]));
  const coeff = [0.2, 0.2, 0.25, 0.05, 0.05, 0.05]
  let domainScore = 0.0; 
  for (let i = 0; i < coeff.length; i++) {
    domainScore += coeff[i] * (domainGoodBalances[i] > domainBadBalances[i] ? 1 : -1);
  }
  const reportersCheck = Math.min(1, Math.sqrt(reportersBalance[0] + reportersBalance[1]) / 10000);
  
  if (domainScore < 0.0  || reportersCheck > 0.4) {
    var community: any[] = [];
    domainBadBalances[6].forEach(function(address: string) {
      community.push(copyable(`${address}`))
    });
    return { content: panel([
      heading(`Transaction or domain look like scam!`), 
      text('Blocked for you by:'), 
      ...community
    ])};
  } else {
    var community: any[] = [];
    domainGoodBalances[6].forEach(function(address: string) {
      community.push(copyable(`${address}`))
    });
    return { content: panel([
      heading(`Transaction and domain seem to be fine!`), 
      text('Approved by:'),
      ...community
    ])};
  }
};

GetBalances(["vitalik.eth", "yabalaban.eth"])