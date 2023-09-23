import { Card, CardBody, Flex, Spacer, Spinner, Text, VStack } from '@chakra-ui/react';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import { queries } from '@sqam/libs';
import { useEffect, useState } from 'react';
import { isAddress, keccak256, toBytes } from 'viem';

interface ReportDisplayProps {
  identifier: string;
}

interface AddressDomainGood {
  address: string;
  good: boolean;
  domain?: string;
}

const ReportDisplay = ({ identifier }: ReportDisplayProps) => {
  const [entries, setEntries] = useState<AddressDomainGood[]>();

  useEffect(() => {
    if (isAddress(identifier)) {
      queries
        .GetRecipientReporters(identifier)
        .then(async (addresses) => {
          const domains = await queries.GetENSDomains(addresses);
          return addresses.map((address) => ({ address, domain: domains[address], good: false }));
        })
        .then(setEntries);
    } else {
      queries
        .GetDomainReporters(keccak256(toBytes(identifier)))
        .then(async (data) => {
          const domains = await queries.GetENSDomains(data.map(([address]) => address));
          return data.map(([address, good]) => ({
            address,
            good,
            domain: domains[address],
          }));
        })
        .then(setEntries);
    }
  }, [identifier, setEntries]);

  return (
    <VStack align="stretch">
      {!entries && (
        <VStack justifyContent="center">
          <Spinner my={4} />
        </VStack>
      )}
      {entries &&
        entries.map((entry) => (
          <Card key={`entry-${entry.address}`}>
            <CardBody>
              <Flex align="center">
                <Text>{entry.domain ?? entry.address}</Text>
                <Spacer />
                {entry.good === true && <CheckIcon color="green.500" />}
                {entry.good === false && <CloseIcon color="red.500" />}
              </Flex>
            </CardBody>
          </Card>
        ))}
    </VStack>
  );
};

export default ReportDisplay;
