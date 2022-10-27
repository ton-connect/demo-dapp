import { useMemo } from 'react';

export function useSlicedAddress(address: string | null | undefined) {
    return useMemo(() => {
        if (!address) {
            return '';
        }

        return address.slice(0,4) + '...' + address.slice(-3)
    }, [address]);
}
