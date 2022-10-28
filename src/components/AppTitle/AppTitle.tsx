import { CHAIN } from '@tonconnect/sdk';
import React, { useMemo } from 'react';
import './style.scss';
import { Badge } from 'antd';
import { useTonWallet } from 'src/hooks/useTonWallet';

const chainNames = {
    [CHAIN.MAINNET]: 'mainnet',
    [CHAIN.TESTNET]: 'testnet',
}

export function AppTitle() {
    const offset: [number, number] = useMemo(() => [40, 20], []);
    const wallet = useTonWallet();

    return (
        wallet ?
            <Badge count={chainNames[wallet.account.chain]} offset={offset}>
                <span className="dapp-title">My Dapp</span>
            </Badge> :
            <span className="dapp-title">My Dapp</span>
    )
}
