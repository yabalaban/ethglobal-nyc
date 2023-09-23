import { OnTransactionHandler } from '@metamask/snaps-types';
import { panel, text, heading } from '@metamask/snaps-ui';
import { GetBalances, GetDomainReporters, GetRecipientReporters } from './queries';

const keccak256 = require('keccak256');

function scoreAddressReporter(balance: number[]): number {
  return 0.5;
}

function scoreDomainReporter(balance: number[]): number {
  return 0.5;
}

export const onTransaction: OnTransactionHandler = async ({ transaction, transactionOrigin }) => {
  const recipient = transaction.to as string; 
  const reporters1 = await GetRecipientReporters(recipient);
  
  const domainHash = `0x${keccak256(transactionOrigin).toString('hex')}`;
  const reporters2 = await GetDomainReporters(domainHash);
  
  const balances1 = await GetBalances(reporters1);
  const addressReportersBalance = reporters1.map(function(r, i) {
    return [r, balances1[i]];
  });

  const balances2 = await GetBalances(reporters2.map((function(r, i) { return r[0]; })));
  const domainReportersBalance = reporters1.map(function(r, i) {
    return [r, balances1[i]];
  });

  const score1 = scoreAddressReporter(balances1);
  const score2 = scoreDomainReporter(balances2);
  const totalScore = 0.2 * score1 + 0.8 * score2;
    
  if (totalScore < 0.3) {
    // high severity, low score
    return { content: [text(`**Transaction type: low score **`)] };
  } else if (totalScore > 0.7) {
    // info level, high score
    return { content: panel([text(`**Transaction type: high score **`)]) };
  } else {
    // info level, no signal
    return { content: panel([text(`**Transaction type: middle score **`)]) };
  }
};


GetBalances(["yabalaban.eth"])