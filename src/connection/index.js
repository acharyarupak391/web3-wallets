import { CoinbaseWallet } from '@web3-react/coinbase-wallet';
import { initializeConnector } from '@web3-react/core';
import { GnosisSafe } from '@web3-react/gnosis-safe';
import { MetaMask } from '@web3-react/metamask';
import { Network } from '@web3-react/network';
import { WalletConnect } from '@web3-react/walletconnect';

import UNISWAP_LOGO_URL from '../assets/svg/logo.svg';
import { SupportedChainId } from '../constants/chains';
import { RPC_URLS } from '../constants/networks';
import { RPC_PROVIDERS } from '../constants/providers';

export const ConnectionType = {
  INJECTED: "INJECTED",
  COINBASE_WALLET: "COINBASE_WALLET",
  WALLET_CONNECT: "WALLET_CONNECT",
  NETWORK: "NETWORK",
  GNOSIS_SAFE: "GNOSIS_SAFE",
};

let metaMaskErrorHandler;
export function setMetMaskErrorHandler(errorHandler) {
  metaMaskErrorHandler = errorHandler;
}

function onError(error) {
  console.debug(`web3-react error: ${error}`);
}

function onMetaMaskError(error) {
  onError(error);
  metaMaskErrorHandler?.(error);
}

const [web3Network, web3NetworkHooks] = initializeConnector(
  (actions) => new Network({ actions, urlMap: RPC_PROVIDERS })
);

export const networkConnection = {
  connector: web3Network,
  hooks: web3NetworkHooks,
  type: ConnectionType.NETWORK,
};

const [web3Injected, web3InjectedHooks] = initializeConnector(
  (actions) => new MetaMask({ actions, onError: onMetaMaskError })
);

export const injectedConnection = {
  connector: web3Injected,
  hooks: web3InjectedHooks,
  type: ConnectionType.INJECTED,
};

const [web3GnosisSafe, web3GnosisSafeHooks] = initializeConnector(
  (actions) => new GnosisSafe({ actions })
);

export const gnosisSafeConnection = {
  connector: web3GnosisSafe,
  hooks: web3GnosisSafeHooks,
  type: ConnectionType.GNOSIS_SAFE,
};

const [web3WalletConnect, web3WalletConnectHooks] = initializeConnector(
  (actions) => {
    // Avoid testing for the best URL by only passing a single URL per chain.
    // Otherwise, WC will not initialize until all URLs have been tested (see getBestUrl in web3-react).
    const RPC_URLS_WITHOUT_FALLBACKS = Object.entries(RPC_URLS).reduce(
      (map, [chainId, urls]) => ({
        ...map,
        [chainId]: urls[0],
      }),
      {}
    );

    return new WalletConnect({
      actions,
      options: {
        rpc: RPC_URLS_WITHOUT_FALLBACKS,
        qrcode: true,
        bridge: "https://bridge.walletconnect.org", // Required
      },
      onError,
    });
  }
);
export const walletConnectConnection = {
  connector: web3WalletConnect,
  hooks: web3WalletConnectHooks,
  type: ConnectionType.WALLET_CONNECT,
};

const [web3CoinbaseWallet, web3CoinbaseWalletHooks] = initializeConnector(
  (actions) =>
    new CoinbaseWallet({
      actions,
      options: {
        url: RPC_URLS[SupportedChainId.MAINNET][0],
        appName: "Uniswap",
        appLogoUrl: UNISWAP_LOGO_URL,
        reloadOnDisconnect: false,
      },
      onError,
    })
);

export const coinbaseWalletConnection = {
  connector: web3CoinbaseWallet,
  hooks: web3CoinbaseWalletHooks,
  type: ConnectionType.COINBASE_WALLET,
};

console.log({ walletConnectConnection });
