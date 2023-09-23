import { Container, VStack } from '@chakra-ui/react';
import { Web3Modal } from '@web3modal/react';
import { WagmiConfig } from 'wagmi';
import { WC_PROJECT_ID, ethereumClient, wagmiConfig } from '../web3/wallet';
import Header from '../components/Header';
import Reports from './Reports';

const Main = () => (
  <>
    <WagmiConfig config={wagmiConfig}>
      <Container py="16px">
        <VStack align="stretch">
          <Header />
          <Reports />
        </VStack>
      </Container>
    </WagmiConfig>

    <Web3Modal projectId={WC_PROJECT_ID} ethereumClient={ethereumClient} />
  </>
);

export default Main;
