import type { OnTransactionHandler } from '@metamask/snaps-types';
import { panel, text } from '@metamask/snaps-ui';
import { GetScoring } from "../../../../scoring/src"

export const onTransaction: OnTransactionHandler = async ({ transaction, transactionOrigin }) => {
  // 1. [Snap] hash origin
  // 2. [Subgraph] query reporter addresses per recipient and origin
  // 3. [Airstack] reporter stats
  // 4. [Snap] local scoring 
  // 5. [Snap] insight (severe or normal) based on the score
  const data = await GetScoring(["yabalaban.eth"]);
};