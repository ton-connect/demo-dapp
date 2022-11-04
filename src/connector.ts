import { TonConnect, UserRejectsError } from '@tonconnect/sdk';
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
