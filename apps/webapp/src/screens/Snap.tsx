import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Heading,
  Image,
  List,
  ListIcon,
  ListItem,
  useToast,
} from '@chakra-ui/react';
import { CheckIcon, LockIcon, StarIcon } from '@chakra-ui/icons';
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
  const shouldDisplay =
    !isMetaMaskReady || !state.installedSnap || shouldDisplayReconnectButton(state.installedSnap);

  return (
    <>
      {shouldDisplay && (
        <>
          <Divider />
          <Card align="center">
            <CardHeader>
              <Heading size="md">Sqam Insights is better with MetaMask</Heading>
            </CardHeader>
            <CardBody>
              <List spacing={3}>
                <ListItem>
                  <ListIcon as={StarIcon} color="green.500" />
                  Tap into community to get scam and fishing insights for every transaction
                </ListItem>
                <ListItem>
                  <ListIcon as={LockIcon} color="green.500" />
                  Avoid scams and keep your wealth secured
                </ListItem>
                <ListItem>
                  <ListIcon as={CheckIcon} color="green.500" />
                  Check if the domain is safe to interact with
                </ListItem>
              </List>
            </CardBody>
            <CardFooter>
              {!isMetaMaskReady && (
                <Button leftIcon={flaskIcon} onClick={onInstall} colorScheme="cyan" variant="solid">
                  Use MetaMask
                </Button>
              )}
              {isMetaMaskReady && !state.installedSnap && (
                <Button
                  leftIcon={flaskIcon}
                  onClick={onConnect}
                  colorScheme="cyan"
                  variant="solid"
                  disabled={!isMetaMaskReady}
                >
                  Install Sqam Insights
                </Button>
              )}
              {isMetaMaskReady && shouldDisplayReconnectButton(state.installedSnap) && (
                <Button
                  leftIcon={flaskIcon}
                  onClick={onConnect}
                  colorScheme="cyan"
                  variant="solid"
                  disabled={!state.installedSnap}
                >
                  🛠️ Reinstall 🛠️
                </Button>
              )}
            </CardFooter>
          </Card>
        </>
      )}
    </>
  );
};

export default Snap;
