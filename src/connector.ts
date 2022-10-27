import { TonConnect } from '@tonconnect/sdk';

export const connector = new TonConnect();

connector.autoConnect();

(window as any).connector = connector;
export function connectToTonkeeper(): string {
    const walletConnectionSource = {
        universalLinkBase: 'https://app.tonkeeper.com/',
        bridgeUrl: 'https://bridge.tonapi.io/bridge/'
    }

    return connector.connect(walletConnectionSource);
}

export function connectToInjected() {
    connector.connect('injected');
}

export async function sendTransaction(tx: any): Promise<{ boc: string }> {
    try {
        const result = await connector.sendTransaction(tx);
        alert(`Send tx result: ${JSON.stringify(result)}`)
        return result;
    } catch (e) {
        alert(e);
        throw e;
    }
}

(window as any).mockTonConnect = mockTonConnect;

export function mockTonConnect() {
    (window as any).tonconnect = {
        listener: undefined,
        autoConnect() {
            return Promise.resolve({
                event: 'connect', payload: {
                    items: [{
                        name: 'ton_addr',
                        address: 'EQ121e'.repeat(8),
                        network: '-239'
                    }],
                    device: {
                        platform: 'iphone',
                        app: 'Tonkeeper',
                        version: '2.7.1'
                    }
                }
            })
        },
        connect() {
            return Promise.resolve({
                    event: 'connect', payload: {
                    items: [{
                        name: 'ton_addr',
                        address: 'abcdef12'.repeat(8),
                        network: '-239'
                    }],
                    device: {
                        platform: 'iphone',
                        app: 'Tonkeeper',
                        version: '2.7.1'
                    }
                }
                })
        },
        // @ts-ignore
        send(req) {
            console.log('Request received', req);
            return Promise.resolve({
                id: req.id,
                result: 'mocked_boc'
            })
        },
        // @ts-ignore
        listen(callback){
            this.listener = callback;
            return () => {};
        }
    }

}
