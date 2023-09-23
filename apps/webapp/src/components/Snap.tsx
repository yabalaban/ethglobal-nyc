import { Button, Image, useToast } from '@chakra-ui/react';
import { MetamaskActions } from '../hooks/MetamaskContext/consts';
import useMetamask from '../hooks/useMetamask';
import {
  SNAP_ORIGIN,
  connectSnap,
  getSnap,
  isLocalSnap,
  shouldDisplayReconnectButton,
} from '../utils/snap';
import FlaskFox from '../assets/flask_fox.svg';

const Snap = () => {
  const toast = useToast();
  const { state, dispatch } = useMetamask();
  const isMetaMaskReady = isLocalSnap(SNAP_ORIGIN) ? state.isFlask : state.snapsDetected;

  const onConnect = async () => {
    try {
      await connectSnap();
      const installedSnap = await getSnap();

      dispatch({
        type: MetamaskActions.SetInstalled,
        payload: installedSnap,
      });
    } catch (e: any) {
      toast({
        title: '🥲 Snap installation error',
        description: e.message ?? e.reason,
        status: 'error',
      });
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  const onInstall = () => {
    window.open('https://metamask.io/flask/', '_blank', 'noopener noreferrer');
  };

  const flaskIcon = <Image src={FlaskFox} alt="Flask Fox" />;

  return (
    <>
      {!isMetaMaskReady && (
        <Button leftIcon={flaskIcon} onClick={onInstall} colorScheme="pink" variant="solid">
          Install MetaMaskFlask
        </Button>
      )}
      {!state.installedSnap && (
        <Button
          leftIcon={flaskIcon}
          onClick={onConnect}
          colorScheme="pink"
          variant="solid"
          disabled={!isMetaMaskReady}
        >
          Install
        </Button>
      )}
      {shouldDisplayReconnectButton(state.installedSnap) && (
        <Button
          leftIcon={flaskIcon}
          onClick={onConnect}
          colorScheme="cyan"
          variant="solid"
          disabled={!state.installedSnap}
        >
          Reinstall
        </Button>
      )}
    </>
  );
};

export default Snap;
