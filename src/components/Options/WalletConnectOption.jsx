import React from 'react';

import WALLET_CONNECT_ICON_URL from '../../assets/images/walletConnectIcon.svg';
import {
  ConnectionType,
  walletConnectConnection,
} from '../../connection';
import { getConnectionName } from '../../connection/utils';
import Option from './Option';

const BASE_PROPS = {
  color: "#4196FC",
  icon: WALLET_CONNECT_ICON_URL,
  id: "wallet-connect",
};

export function WalletConnectOption({ tryActivation }) {
  const isActive = walletConnectConnection.hooks.useIsActive();
  return (
    <Option
      {...BASE_PROPS}
      isActive={isActive}
      onClick={() => tryActivation(walletConnectConnection.connector)}
      header={getConnectionName(ConnectionType.WALLET_CONNECT)}
    />
  );
}
