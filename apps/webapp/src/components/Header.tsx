import { Button, Flex, Spacer, Text, useColorMode } from '@chakra-ui/react';
import { Web3Button } from '@web3modal/react';

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
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
  );
};

export default Header;
