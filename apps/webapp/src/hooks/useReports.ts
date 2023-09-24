import { useCallback, useEffect, useState } from 'react';
import { queries } from '@sqam/libs';

const useReports = () => {
  const [reports, setReports] = useState<string[]>([]);

  const reloadReports = useCallback(async () => {
    const [addresses, domains] = await Promise.all([
      queries.GetAllReportedAddresses(),
      queries.GetAllReportedDomains(),
    ]);
    setReports([...new Set([...addresses, ...domains])]);
  }, [setReports]);

  useEffect(() => {
    reloadReports();
  }, [reloadReports]);

  return { reloadReports, reports };
};

export default useReports;
