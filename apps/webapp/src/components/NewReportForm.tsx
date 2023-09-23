import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Button,
} from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import { Address } from 'viem';
import { DomainReportType, NewReportFormProps } from '../types/report';

function isAddressValid(address: string): boolean {
  return !!address.match(/^0x\w{40}$/);
}

const NewReportForm = ({ isLoading, onReport }: NewReportFormProps) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [domain, setDomain] = useState('');
  const [address, setAddress] = useState('');
  const [domainReportType, setDomainReportType] = useState<DomainReportType>('good');
  const isReportingEnabled = useMemo(
    () => (tabIndex === 0 && domain.length > 0) || (tabIndex === 1 && isAddressValid(address)),
    [tabIndex, domain, address],
  );

  const reportButton = (
    <Button
      isLoading={isLoading}
      colorScheme="blue"
      isDisabled={!isReportingEnabled}
      onClick={() =>
        onReport(
          tabIndex === 0 ? { domain, type: domainReportType } : { address: address as Address },
        )
      }
    >
      Report
    </Button>
  );

  return (
    <Tabs variant="soft-rounded" colorScheme="yellow" onChange={(index) => setTabIndex(index)}>
      <TabList>
        <Tab>Domain</Tab>
        <Tab>Address</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <VStack spacing="4" alignItems="start">
            <FormControl isRequired>
              <FormLabel>Domain</FormLabel>
              <Input
                value={domain}
                placeholder="https://scam.url/"
                type="url"
                onChange={(e) => setDomain(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Is this domain doing good or bad?</FormLabel>
              <RadioGroup
                onChange={(value) => setDomainReportType(value as DomainReportType)}
                value={domainReportType}
              >
                <Stack direction="row">
                  <Radio value="good">Good</Radio>
                  <Radio value="bad">Bad</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>
            {reportButton}
          </VStack>
        </TabPanel>
        <TabPanel>
          <VStack spacing="4" alignItems="start">
            <FormControl isRequired>
              <FormLabel>Address</FormLabel>
              <Input
                value={address}
                placeholder="0x00002739FAE27C5A3F3f6bECcEf7e51002790000"
                onChange={(e) => setAddress(e.target.value)}
              />
            </FormControl>
            {reportButton}
          </VStack>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default NewReportForm;
