import { TonConnectError, UserRejectsError } from '@tonconnect/sdk';
import { useCallback, useEffect } from 'react';
import { connector } from '../connector';

export function useTonWalletConnectionError(callback: () => void) {
    const errorsHandler = useCallback((error: unknown) => {
        debugger;
        console.log(error instanceof TonConnectError);
        console.log(error instanceof UserRejectsError);
        if (typeof error === 'object' && error instanceof UserRejectsError) {
            callback();
        }
    }, [callback])

    const emptyCallback = useCallback(() => {}, []);

    useEffect(() =>  connector.onStatusChange(emptyCallback, errorsHandler), []);
}
