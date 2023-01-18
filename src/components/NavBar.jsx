import { useState } from 'react';

import styled from 'styled-components';

import { Web3ReactProvider } from '@web3-react/core';

import {
  coinbaseWalletConnection,
  gnosisSafeConnection,
  injectedConnection,
  networkConnection,
  walletConnectConnection,
} from '../connection';
import { getConnectionName } from '../connection/utils';
import { WalletModal } from './WalletModal';

const Nav = styled.nav`
  padding: 20px 12px;
  width: 100%;
  z-index: 2;
`;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleWalletModal = () => {
    setIsOpen((_prev) => !_prev);
  };

  const NavComponent = () => (
    <Nav>
      <ButtonLight onClick={toggleWalletModal} fontWeight={600}>
        Connect Wallet
      </ButtonLight>

      <WalletModal open={isOpen} setOpen={setIsOpen} />
    </Nav>
  );

  const connections = [
    networkConnection,
    injectedConnection,
    gnosisSafeConnection,
    walletConnectConnection,
    coinbaseWalletConnection,
  ];
  const connectors = connections.map(({ hooks, connector }) => [
    connector,
    hooks,
  ]);

  const key = connections.map(({ type }) => getConnectionName(type)).join("-");

  return (
    <>
      <Web3ReactProvider connectors={connectors} key={key}>
        <NavComponent />
      </Web3ReactProvider>
    </>
  );
};

const ButtonLight = styled.button`
  font-size: 16px;
  font-family: sans-serif;
  font-weight: 600;
  padding: 8px 12px;
  border-radius: 8px;
  border: darkblue;
  background-color: lightblue;
  color: blue;
  cursor: pointer;
`;

export default Navbar;
