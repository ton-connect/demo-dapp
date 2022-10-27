import { TonConnect } from '@tonconnect/sdk';
import { SendTransactionRequest } from '@tonconnect/sdk/lib/models/methods';

export const connector = new TonConnect();

connector.autoConnect();


export function connectToTonkeeper(): string {
    const walletConnectionSource = {
        universalLinkBase: '',
        bridgeUrl: ''
    }

    return connector.connect(walletConnectionSource);
}

export function connectToInjected() {
    connector.connect('injected');
}

export async function sendTransaction(): Promise<{ boc: string }> {
    const tx = {
        valid_until: Date.now() + 1000000,
        messages: [
            {
                address: "0:412410771DA82CBA306A55FA9E0D43C9D245E38133CB58F1457DFB8D5CD8892F",
                amount: "20000000",
                initState: "base64bocblahblahblah==" //deploy contract
            },
            {
                address: "0:E69F10CC84877ABF539F83F879291E5CA169451BA7BCE91A37A5CED3AB8080D3",
                amount: "60000000",
                payload: "base64bocblahblahblah==" //transfer nft to new deployed account 0:412410771DA82CBA306A55FA9E0D43C9D245E38133CB58F1457DFB8D5CD8892F
            }
        ]
    }

    try {
        return await connector.sendTransaction(tx);
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
          return Promise.resolve({ event: 'connect_error' })
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
        send() {

        },
        // @ts-ignore
        listen(callback){
            this.listener = callback;
            return () => {};
        }
    }

}
