import { Connector } from '@web3-react/types';

import {
  coinbaseWalletConnection,
  ConnectionType,
  gnosisSafeConnection,
  injectedConnection,
  networkConnection,
  walletConnectConnection,
} from './index';

export function getIsInjected() {
  return Boolean(window.ethereum);
}

export function getHasMetaMaskExtensionInstalled() {
  return window.ethereum?.isMetaMask ?? false;
}

export function getHasCoinbaseExtensionInstalled() {
  return window.ethereum?.isCoinbaseWallet ?? false;
}

export function getIsMetaMask(connectionType) {
  return (
    connectionType === ConnectionType.INJECTED &&
    getHasMetaMaskExtensionInstalled()
  );
}

const CONNECTIONS = [
  gnosisSafeConnection,
  injectedConnection,
  coinbaseWalletConnection,
  walletConnectConnection,
  networkConnection,
];
export function getConnection(c) {
  if (c instanceof Connector) {
    const connection = CONNECTIONS.find(
      (connection) => connection.connector === c
    );
    if (!connection) {
      throw Error("unsupported connector");
    }
    return connection;
  } else {
    switch (c) {
      case ConnectionType.INJECTED:
        return injectedConnection;

      case ConnectionType.COINBASE_WALLET:
        return coinbaseWalletConnection;

      case ConnectionType.WALLET_CONNECT:
        return walletConnectConnection;

      case ConnectionType.NETWORK:
        return networkConnection;

      case ConnectionType.GNOSIS_SAFE:
        return gnosisSafeConnection;

      default:
        return injectedConnection;
    }
  }
}

export function getConnectionName(
  connectionType,
  hasMetaMaskExtension = getHasMetaMaskExtensionInstalled()
) {
  switch (connectionType) {
    case ConnectionType.INJECTED:
      return hasMetaMaskExtension ? "MetaMask" : "Browser Wallet";

    case ConnectionType.COINBASE_WALLET:
      return "Coinbase Wallet";

    case ConnectionType.WALLET_CONNECT:
      return "WalletConnect";

    case ConnectionType.NETWORK:
      return "Network";

    case ConnectionType.GNOSIS_SAFE:
      return "Gnosis Safe";

    default:
      return hasMetaMaskExtension ? "MetaMask" : "Browser Wallet";
  }
}
