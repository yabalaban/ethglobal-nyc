import { OnRpcRequestHandler, OnTransactionHandler } from '@metamask/snaps-types';
import { panel, text, heading } from '@metamask/snaps-ui';
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

  const domainCheck = [
    domainGoodBalances[0] > domainBadBalances[0] ? 1 : 0,
    domainGoodBalances[1] > domainBadBalances[1] ? 1 : 0,
    domainGoodBalances[2] > domainBadBalances[2] ? 1 : 0,
  ].reduce(function(a, b){ return a + b; }) >= 2;
  const reportersCheck = Math.min(1, Math.sqrt(reportersBalance[0] + reportersBalance[1]) / 10000);

  if (!domainCheck || reportersCheck > 0.4) {
    return { content: panel([text(`**Transaction type: high score **`)]) };
  } else {
    // all good, nothing to care about
    return { content: panel([text(`**Transaction type: low score **`)]) };
  }
};
