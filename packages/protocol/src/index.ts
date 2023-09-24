import { queries } from '@sqam/libs';
import keccak256 from 'keccak256';
import { TxScoreDecision, TxScoreRequest, TxScoreResponse } from './types';
import { getScore } from './utils';

export async function scoreTransaction({ to, origin }: TxScoreRequest): Promise<TxScoreResponse> {
  const recipientReporters = await queries.GetRecipientReporters(to);
  const reportersBalance = await queries.GetBalances(recipientReporters);

  // TODO: better typing
  let domainGoodReporters: any[] = [];
  let domainBadReporters: any[] = [];

  if (origin) {
    const domainHash = `0x${keccak256(origin).toString('hex')}`;
    const domainReportes = await queries.GetDomainReporters(domainHash);
    domainGoodReporters = domainReportes.filter(([, good]) => good);
    domainBadReporters = domainReportes.filter(([, good]) => !good);
  }

  const [domainGoodBalances, domainBadBalances] = await Promise.all([
    queries.GetBalances(domainGoodReporters.map(([addr]) => addr)),
    queries.GetBalances(domainBadReporters.map(([addr]) => addr)),
  ]);

  const domainScore = getScore(domainGoodBalances, domainBadBalances);
  const toScore = getScore([0, 0, 0, 0, 0, 0], reportersBalance);

  if (domainScore < 0.0 || toScore < 0.0) {
    return {
      supporters: [...domainBadBalances[6], ...reportersBalance[6]],
      decision: TxScoreDecision.Reject,
      description: 'Transaction or domain look like scam!',
    };
  }

  return {
    supporters: [...domainGoodBalances[6]],
    decision: TxScoreDecision.Approve,
    description: 'Transaction and domain seem to be fine!',
  };
}

export { TxScoreDecision, TxScoreRequest, TxScoreResponse };
