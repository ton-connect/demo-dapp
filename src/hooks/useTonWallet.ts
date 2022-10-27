import { Wallet } from '@tonconnect/sdk/lib/models';
import { useEffect, useState } from 'react';
import { connector } from '../connector';

export function useTonWallet() {
    const [wallet, setWallet] = useState<Wallet | null>(connector.wallet);

    useEffect(() =>  connector.onStatusChange(setWallet), []);

    return wallet;
}
