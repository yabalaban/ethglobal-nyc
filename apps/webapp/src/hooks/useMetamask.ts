import { useContext } from 'react';
import { MetaMaskContext } from './MetamaskContext';

const useMetamask = () => {
  const [state, dispatch] = useContext(MetaMaskContext);
  return { state, dispatch };
};

export default useMetamask;
