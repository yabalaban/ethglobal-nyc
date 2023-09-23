import { useCallback, useEffect, useState } from 'react';
import { Address } from 'viem';
import { queries } from '@sqam/libs';

const useReports = ({ address }: { address?: Address }) => {
  const [reports, setReports] = useState<string[]>([]);

  const reloadReports = useCallback(async () => {
    if (!address) {
      setReports([]);
      return;
    }

    const [addresses, domains] = await Promise.all([
      queries.GetMyReportedAddresses(address),
      queries.GetMyReportedDomains(address),
    ]);
    setReports([...new Set([...addresses, ...domains])]);
  }, [address, setReports]);

  useEffect(() => {
    reloadReports();
  }, [address]);

  return { reloadReports, reports };
};

export default useReports;
