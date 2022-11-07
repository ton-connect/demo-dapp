import React, { useCallback, useEffect, useState } from 'react';
import { useRecoilValueLoadable } from 'recoil';
import { connector, connectToWallet } from 'src/connector';
import { useForceUpdate } from 'src/hooks/useForceUpdate';
import { useSlicedAddress } from 'src/hooks/useSlicedAddress';
import { useTonWallet } from 'src/hooks/useTonWallet';
import { Button, Dropdown, Menu, Modal, notification, Space } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { useTonWalletConnectionError } from 'src/hooks/useTonWalletConnectionError';
import { walletsListQuery } from 'src/state/wallets-list';
import { isMobile } from 'src/utils';
import QRCode from "react-qr-code";
import './style.scss';

const menu = (
    <Menu
        onClick={() => connector.disconnect()}
        items={[
            {
                label: 'Disconnect',
                key: '1',
            }
        ]}
    />
);

export function AuthButton() {
    const [modalUniversalLink, setModalUniversalLink] = useState('');
    const forceUpdate = useForceUpdate();
    const wallet = useTonWallet();
    const onConnectErrorCallback = useCallback(() => {
        setModalUniversalLink('');
        notification.error({
            message: 'Connection was rejected',
            description: 'Please approve connection to the dApp in your wallet.'
        });
    }, []);
    useTonWalletConnectionError(onConnectErrorCallback);

    const walletsList = useRecoilValueLoadable(walletsListQuery);

    const address = useSlicedAddress(wallet?.account.address);

    useEffect(() => {
        if (modalUniversalLink && wallet) {
            setModalUniversalLink('');
        }
    }, [modalUniversalLink, wallet])

    const handleButtonClick = useCallback(async () => {
        // Use loading screen/UI instead (while wallets list is loading)
        if (!(walletsList.state === 'hasValue')) {
            setTimeout(handleButtonClick, 200);
        }

        if (walletsList.contents.inWhichWalletBrowser) {
            connector.connect(walletsList.contents.inWhichWalletBrowser);
            return;
        }

        const tonkeeperConnectionSource = walletsList.contents.all[0];

        const universalLink = connectToWallet(tonkeeperConnectionSource);

        if (isMobile()) {
            window.location.assign(universalLink);
        } else {
            setModalUniversalLink(universalLink);
        }
    }, [walletsList]);

    return (
        <>
            <div className="auth-button">
                {wallet ?
                    <Dropdown overlay={menu}>
                        <Button shape="round" type="primary">
                            <Space>
                                { address }
                                <DownOutlined/>
                            </Space>
                        </Button>
                    </Dropdown> :
                    <Button shape="round" type="primary" onClick={handleButtonClick}>
                        Connect Wallet
                    </Button>
                }
            </div>
            <Modal title="Connect to Tonkeeper" open={!!modalUniversalLink} onOk={() => setModalUniversalLink('')} onCancel={() => setModalUniversalLink('')}>
                <QRCode
                    size={256}
                    style={{ height: "260px", maxWidth: "100%", width: "100%" }}
                    value={modalUniversalLink}
                    viewBox={`0 0 256 256`}
                />
            </Modal>
        </>

    );
}
