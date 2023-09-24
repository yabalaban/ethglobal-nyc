import { type OnTransactionHandler } from '@metamask/snaps-types';
import { copyable, heading, panel, text } from '@metamask/snaps-ui';
import { TxScoreDecision, scoreTransaction } from '@sqam/protocol';

export const onTransaction: OnTransactionHandler = async ({
  transaction,
  transactionOrigin,
}) => {
  try {
    const { decision, description, supporters } = await scoreTransaction({
      to: transaction.to as `0x${string}`,
      origin: transactionOrigin,
    });

    return {
      content: panel([
        heading(description),
        ...(supporters.length ? [text(decision === TxScoreDecision.Reject ? 'Blocked for you by:' : 'Approved by:')] : []),
        ...supporters.map((address: string) => copyable(address)),
      ]),
      ...(decision === TxScoreDecision.Reject ? { severity: 'critical' } : {}),
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
