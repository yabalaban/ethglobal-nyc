import {
  SeverityLevel,
  type OnTransactionHandler,
} from '@metamask/snaps-types';
import { panel, text } from '@metamask/snaps-ui';
import { queries } from '@sqam/libs';
import keccak256 from 'keccak256';

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
    const coeff = [0.2, 0.2, 0.25, 0.05, 0.05, 0.05];
    let domainScore = 0.0;
    for (let i = 0; i < coeff.length; i++) {
      if (domainGoodBalances[i] === 0 && domainBadBalances[i] === 0) {
        continue;
      }
      domainScore +=
        coeff[i] * (domainGoodBalances[i] > domainBadBalances[i] ? 1 : -1);
    }
    const reportersCheck = Math.min(
      1,
      Math.sqrt(reportersBalance[0] + reportersBalance[1]) / 10000,
    );

    if (domainScore < 0.0 || reportersCheck > 0.4) {
      return {
        content: panel([text(`**Transaction type: high score **`)]),
        severity: SeverityLevel.Critical,
      };
    }

    return { content: panel([text(`**Transaction type: low score **`)]) };
  } catch (e) {
    console.error(e);
    return { content: panel([text(`**Transaction type: low score **`)]) };
  }
};
