import React, { useCallback } from 'react';

import styled from 'styled-components';

import { useWeb3React } from '@web3-react/core';

import {
  getConnection,
  getHasCoinbaseExtensionInstalled,
  getHasMetaMaskExtensionInstalled,
  getIsInjected,
} from '../connection/utils';
import { isMobile } from '../utils/userAgent';
import {
  CoinbaseWalletOption,
  OpenCoinbaseWalletOption,
} from './Options/CoinbaseWalletOption';
import {
  InjectedOption,
  InstallMetaMaskOption,
  MetaMaskOption,
} from './Options/InjectedOption';
import { WalletConnectOption } from './Options/WalletConnectOption';

export const WalletModal = ({ open, setOpen }) => {
  const { chainId, account, connector } = useWeb3React();

  const tryActivation = useCallback(async (connector) => {
    const connectionType = getConnection(connector).type;
    console.log({ connectionType });

    try {
      await connector.activate();
    } catch (error) {
      console.debug(`web3-react connection error: ${error}`);
    }
  }, []);

  const deactivate = useCallback(async () => {
    if (connector && connector.deactivate) {
      connector.deactivate();
    }
    connector.resetState();
  }, [connector]);

  function getOptions() {
    const isInjected = getIsInjected();
    const hasMetaMaskExtension = getHasMetaMaskExtensionInstalled();
    const hasCoinbaseExtension = getHasCoinbaseExtensionInstalled();

    const isCoinbaseWalletBrowser = isMobile && hasCoinbaseExtension;
    const isMetaMaskBrowser = isMobile && hasMetaMaskExtension;
    const isInjectedMobileBrowser =
      isCoinbaseWalletBrowser || isMetaMaskBrowser;

    let injectedOption;
    if (!isInjected) {
      if (!isMobile) {
        injectedOption = <InstallMetaMaskOption />;
      }
    } else if (!hasCoinbaseExtension) {
      if (hasMetaMaskExtension) {
        injectedOption = <MetaMaskOption tryActivation={tryActivation} />;
      } else {
        injectedOption = <InjectedOption tryActivation={tryActivation} />;
      }
    }

    let coinbaseWalletOption;
    if (isMobile && !isInjectedMobileBrowser) {
      coinbaseWalletOption = <OpenCoinbaseWalletOption />;
    } else if (!isMobile || isCoinbaseWalletBrowser) {
      coinbaseWalletOption = (
        <CoinbaseWalletOption tryActivation={tryActivation} />
      );
    }

    const walletConnectionOption =
      (!isInjectedMobileBrowser && (
        <WalletConnectOption tryActivation={tryActivation} />
      )) ??
      null;

    return (
      <WalletList>
        {injectedOption}
        {coinbaseWalletOption}
        {walletConnectionOption}
      </WalletList>
    );
  }

  if (!open) return <></>;

  return (
    <Container>
      <Overlay onClick={() => setOpen(false)} />

      <Content>
        {account ? (
          <div>
            <p>{account}</p>
            <i>
              Chain: <b>{chainId}</b>
            </i>
            <br />
            <br />
            <button onClick={() => deactivate()}>Disconnect</button>
          </div>
        ) : (
          getOptions()
        )}
      </Content>
    </Container>
  );
};

const Container = styled.div``;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.25);
`;

const Content = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);

  min-width: 500px;
  min-height: 400px;
  padding: 10px;
  border-radius: 6px;
  background-color: white;
  z-index: 2;

  @media (max-width: 768px) {
    min-width: 300px;
    min-height: 400px;
  }
`;

const WalletList = styled.div`
  & > *:not(:first-child) {
    margin-top: 16px;
  }
`;
