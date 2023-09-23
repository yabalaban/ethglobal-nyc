import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import Main from './screens/Main.tsx';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { MetaMaskProvider } from './hooks/MetamaskContext/index.tsx';

const theme = extendTheme({
  config: {
    initialColorMode: 'system',
    useSystemColorMode: false,
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <MetaMaskProvider>
        <Main />
      </MetaMaskProvider>
    </ChakraProvider>
  </React.StrictMode>,
);
