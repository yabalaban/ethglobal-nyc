import { AddIcon } from '@chakra-ui/icons';
import {
  VStack,
  HStack,
  Spacer,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import NewReportForm from '../components/NewReportForm';
import { AddressReport, DomainReport } from '../types/report';
import { useSqamReportAddress, useSqamReportDomain } from '../web3/contracts';
import { SQAM_CONTRACT } from '../web3/wallet';
import { Address, keccak256, toHex } from 'viem';
import { waitForTransactionReceipt } from 'viem/actions';
import { usePublicClient } from 'wagmi';

const Reports = () => {
  const publicClient = usePublicClient();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isNewReportModalOpen, setIsNewReportModalOpen] = useState(false);
  const { writeAsync: reportAddress } = useSqamReportAddress({
    address: SQAM_CONTRACT,
  });
  const { writeAsync: reportDomain } = useSqamReportDomain({
    address: SQAM_CONTRACT,
  });

  const onReport = async (report: DomainReport | AddressReport) => {
    setIsLoading(true);
    try {
      let receipt: { hash: Address };
      if ('domain' in report) {
        receipt = await reportDomain({
          args: [keccak256(toHex(report.domain)), report.type === 'good'],
        });
      } else {
        receipt = await reportAddress({
          args: [report.address],
        });
      }
      await waitForTransactionReceipt(publicClient, { ...receipt, confirmations: 2 });
      setIsNewReportModalOpen(false);
      toast({
        title: '🎉 Reported',
        description: 'Thanks for your report!',
        status: 'success',
      });
    } catch (e: any) {
      toast({
        title: 'Reporting error',
        description: e.message ?? e.reason,
        status: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <VStack align="stretch">
        <HStack pt="12px">
          <Text as="b" fontSize="xl">
            Reports
          </Text>
          <Spacer />
          <IconButton
            aria-label="New"
            icon={<AddIcon />}
            colorScheme="green"
            rounded="full"
            size="md"
            onClick={() => setIsNewReportModalOpen(true)}
            flexShrink={1}
          />
        </HStack>
        <VStack alignItems="stretch">
          <></>
        </VStack>
      </VStack>
      <Modal isOpen={isNewReportModalOpen} size="xl" onClose={() => setIsNewReportModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>New report</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <NewReportForm isLoading={isLoading} onReport={onReport} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Reports;