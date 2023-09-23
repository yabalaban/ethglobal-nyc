import { Address } from 'viem';

export type DomainReportType = 'good' | 'bad';

export interface AddressReport {
  address: Address;
}

export interface DomainReport {
  domain: string;
  type: DomainReportType;
}

export interface NewReportFormProps {
  isLoading: boolean;
  onReport: (report: AddressReport | DomainReport) => void;
}
