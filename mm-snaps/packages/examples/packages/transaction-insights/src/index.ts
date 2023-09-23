import { type OnTransactionHandler } from '@metamask/snaps-types';
import { copyable, heading, panel, text } from '@metamask/snaps-ui';
import { queries } from '@sqam/libs';
import keccak256 from 'keccak256';

function getScore(goodBalances: any[], badBalances: any[]) {
  const coeff = [0.2, 0.2, 0.25, 0.05, 0.05, 0.05];
  let score = 0.0;
  for (let i = 0; i < coeff.length; i++) {
    if (goodBalances[i] === 0 && badBalances[i] === 0) {
      continue;
    }
    score +=
      coeff[i] * (goodBalances[i] > badBalances[i] ? 1 : -1);
  }
  return score;
}

export const onTransaction: OnTransactionHandler = async ({
  transaction,
  transactionOrigin,
}) => {
  const recipient = transaction.to as string;
  const recipientReporters = await queries.GetRecipientReporters(recipient);
  const reportersBalance = await queries.GetBalances(recipientReporters);

  let domainGoodReporters: any[] = [];
  let domainBadReporters: any[] = [];

  if (transactionOrigin) {
    console.log('transactionOrigin', transactionOrigin);
    const domainHash = `0x${keccak256(transactionOrigin).toString('hex')}`;
    const domainReportes = await queries.GetDomainReporters(domainHash);
    domainGoodReporters = domainReportes.filter(([, good]) => good);
    domainBadReporters = domainReportes.filter(([, good]) => !good);
  }

  try {
    const [domainGoodBalances, domainBadBalances] = await Promise.all([
      queries.GetBalances(domainGoodReporters.map(([addr]) => addr)),
      queries.GetBalances(domainBadReporters.map(([addr]) => addr)),
    ]);

    const domainScore = getScore(domainGoodBalances, domainBadBalances);
    const toScore = getScore([0, 0, 0, 0, 0, 0], reportersBalance);

    console.log('toScore', toScore);
    console.log('domainScore', domainScore);

    if (domainScore < 0.0 || toScore < 0.0) {
      const community: any[] = [];
      new Set([...domainBadBalances[6], ...reportersBalance[6]]).forEach((address: any) => {
        community.push(copyable(address));
      });
      return {
        content: panel([
          heading(`Transaction or domain look like scam!`),
          text('Blocked for you by:'),
          ...community,
        ]),
        severity: 'critical',
      };
    }

    const community: any[] = [];
    domainGoodBalances[6].forEach((address: string) => {
      community.push(copyable(address));
    });
    return {
      content: panel([
        heading(`Transaction and domain seem to be fine!`),
        text('Approved by:'),
        ...community,
      ]),
    };
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error(error);
    return {
      content: panel([
        text('Unable to assess transaction. Proceed at your own judgement'),
      ]),
    };
  }
};
