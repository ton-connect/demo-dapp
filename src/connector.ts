import { TonConnect, UserRejectsError } from '@tonconnect/sdk';
import { notification } from 'antd';


// Just to fix Githab pages url problem.
// If your app main route is hte same as `window.location.origin` you don't have to pass this argument to the TonConnect constructor
const dappMetadata = { dappMetedata: { url: 'https://ton-connect.github.io/demo-dapp/' }};

export const connector = new TonConnect(dappMetadata);

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
        let message = 'Send transaction error';
        let description = '';

        if (typeof e === 'object' && e instanceof UserRejectsError) {
            message = 'You rejected the transaction'
            description = 'Please try again and confirm transaction in your wallet.'
        }

        notification.error({
            message,
            description
        });
        console.log(e);
        throw e;
    }
}


(window as any).mockTonConnect = mockTonConnect;
//mockTonConnect();

export function mockTonConnect() {
    (window as any).tonkeeper = {
        tonconnect: {
            listener: undefined,
            isWalletBrowser: true,
            disconnect() {},
            restoreConnection() {
                return Promise.resolve({
                    event: 'connect', payload: {
                        items: [{
                            name: 'ton_addr',
                            address: '0:412410771DA82CBA306A55FA9E0D43C9D245E38133CB58F1457DFB8D5CD8892F',
                            network: '-239'
                        },
                        {
                            name: 'ton_proof',
                            proof: {
                                timestamp: Math.round(Date.now() / 1000),
                                domain: {
                                    lengthBytes: 15,
                                    value: 'toncoolswap.com'
                                },
                                payload: 'test_ton_proof 123',
                                signature: '0x'+ '1234'.repeat(64)
                            }
                        }
                        ],
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
                            address: '0:412410771DA82CBA306A55FA9E0D43C9D245E38133CB58F1457DFB8D5CD8892F',
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
            listen(callback) {
                this.listener = callback;
                return () => {
                };
            }
        }
    }

}
