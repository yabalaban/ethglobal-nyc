import { Button, Flex, HStack, Spacer, Text, VStack, useColorMode } from '@chakra-ui/react';
import { Web3Button } from '@web3modal/react';
import Snap from './Snap';

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <VStack alignItems="stretch" spacing={4}>
      <Flex align="center">
        <Text as="b" fontSize="xl">
          Sqam
        </Text>
        <Spacer />
        <Button onClick={toggleColorMode} variant="ghost" size="md" borderRadius="xl" mr={2}>
          {colorMode === 'light' ? '🌚' : '🌝'}
        </Button>
        <Web3Button />
      </Flex>
      <HStack justifyContent="end">
        <Snap />
      </HStack>
    </VStack>
  );
};

export default Header;
