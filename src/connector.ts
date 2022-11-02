import { TonConnect } from '@tonconnect/sdk';
import { notification } from 'antd';


// Just to fix Githab pages url problem.
// If your app main route is hte same as `window.location.origin` you don't have to pass this argument to the TonConnect constructor
const dappMetadata = { dappMetedata: { url: 'https://ton-connect.github.io/demo-dapp/' }};

export const connector = new TonConnect(dappMetadata);

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
        notification.success({
            message: 'Successful transaction',
            description:
                'You transaction was successfully sent. Please wait until the transaction is included to the TON blockchain.',
            duration: 5,
        });
        console.log(`Send tx result: ${JSON.stringify(result)}`)
        return result;
    } catch (e) {
        notification.error({
            message: 'Send transaction error',
            description: ''
        });
        console.log(e);
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
