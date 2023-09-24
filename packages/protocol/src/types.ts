export interface TxScoreRequest {
  /// Recipient or Smart contract address
  to: `0x${string}`;

  /// URL where transaction was initiated
  origin?: string;
}

export enum TxScoreDecision {
  Approve = 'approve',
  Reject = 'reject',
}

export interface TxScoreResponse {
  /// Decision made by the protocol
  decision: TxScoreDecision;

  /// Description of the decision
  description: string;

  /// List of ENS names that supported the decision
  supporters: string[];
}
