import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum';
import { Address, configureChains, createConfig } from 'wagmi';
import { sepolia, base, gnosis } from 'wagmi/chains';
import { SafeConnector } from 'wagmi/connectors/safe';

const chains = [sepolia, base, gnosis];
export const WC_PROJECT_ID = import.meta.env.VITE_WC_PROJECT_ID;

const { publicClient } = configureChains(chains, [w3mProvider({ projectId: WC_PROJECT_ID })]);
export const wagmiConfig = createConfig({
  connectors: [
    ...w3mConnectors({ projectId: WC_PROJECT_ID, chains }),
    new SafeConnector({
      chains,
      options: {
        allowedDomains: [/app.safe.global$/],
        debug: false,
      },
    }),
  ],
  publicClient,
});
export const ethereumClient = new EthereumClient(wagmiConfig, chains);

export const SQAM_CONTRACT = import.meta.env.VITE_SQAM_CONTRACT as Address;
