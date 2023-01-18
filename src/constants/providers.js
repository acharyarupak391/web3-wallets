import { deepCopy } from '@ethersproject/properties';
import { StaticJsonRpcProvider } from '@ethersproject/providers';
// This is the only file which should instantiate new Providers.
import { isPlain } from '@reduxjs/toolkit';

import { AVERAGE_L1_BLOCK_TIME } from './chainInfo';
import {
  CHAIN_IDS_TO_NAMES,
  SupportedChainId,
} from './chains';
import { RPC_URLS } from './networks';

class AppJsonRpcProvider extends StaticJsonRpcProvider {
  _blockCache = new Map();

  get blockCache() {
    // If the blockCache has not yet been initialized this block, do so by
    // setting a listener to clear it on the next block.
    if (!this._blockCache.size) {
      this.once("block", () => this._blockCache.clear());
    }
    return this._blockCache;
  }

  constructor(chainId) {
    // Including networkish allows ethers to skip the initial detectNetwork call.
    super(
      RPC_URLS[chainId][0],
      /* networkish= */ { chainId, name: CHAIN_IDS_TO_NAMES[chainId] }
    );

    // NB: Third-party providers (eg MetaMask) will have their own polling intervals,
    // which should be left as-is to allow operations (eg transaction confirmation) to resolve faster.
    // Network providers (eg AppJsonRpcProvider) need to update less frequently to be considered responsive.
    this.pollingInterval = AVERAGE_L1_BLOCK_TIME;
  }

  send(method, params) {
    // Only cache eth_call's.
    if (method !== "eth_call") return super.send(method, params);

    // Only cache if params are serializable.
    if (!isPlain(params)) return super.send(method, params);

    const key = `call:${JSON.stringify(params)}`;
    const cached = this.blockCache.get(key);
    if (cached) {
      this.emit("debug", {
        action: "request",
        request: deepCopy({ method, params, id: "cache" }),
        provider: this,
      });
      return cached;
    }

    const result = super.send(method, params);
    this.blockCache.set(key, result);
    return result;
  }
}

/**
 * These are the only JsonRpcProviders used directly by the interface.
 */
export const RPC_PROVIDERS = {
  [SupportedChainId.MAINNET]: RPC_URLS[SupportedChainId.MAINNET],
  [SupportedChainId.RINKEBY]: RPC_URLS[SupportedChainId.RINKEBY],
  [SupportedChainId.ROPSTEN]: RPC_URLS[SupportedChainId.ROPSTEN],
  [SupportedChainId.GOERLI]: RPC_URLS[SupportedChainId.GOERLI],
  [SupportedChainId.KOVAN]: RPC_URLS[SupportedChainId.KOVAN],
  [SupportedChainId.OPTIMISM]: RPC_URLS[SupportedChainId.OPTIMISM],
  [SupportedChainId.OPTIMISM_GOERLI]:
    RPC_URLS[SupportedChainId.OPTIMISM_GOERLI],
  [SupportedChainId.ARBITRUM_ONE]: RPC_URLS[SupportedChainId.ARBITRUM_ONE],
  [SupportedChainId.ARBITRUM_RINKEBY]:
    RPC_URLS[SupportedChainId.ARBITRUM_RINKEBY],
  [SupportedChainId.POLYGON]: RPC_URLS[SupportedChainId.POLYGON],
  [SupportedChainId.POLYGON_MUMBAI]: RPC_URLS[SupportedChainId.POLYGON_MUMBAI],
  [SupportedChainId.CELO]: RPC_URLS[SupportedChainId.CELO],
  [SupportedChainId.CELO_ALFAJORES]: RPC_URLS[SupportedChainId.CELO_ALFAJORES],
};
