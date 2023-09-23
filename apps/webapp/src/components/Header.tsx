import { Button, Flex, Spacer, Text, VStack, useColorMode } from '@chakra-ui/react';
import { Web3Button } from '@web3modal/react';
import { useAutoConnect } from '../hooks/useAutoconnect';

const Header = () => {
  useAutoConnect();
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
    </VStack>
  );
};

export default Header;
