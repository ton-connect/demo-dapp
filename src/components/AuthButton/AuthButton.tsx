import React, { useCallback, useState } from 'react';
import { connector, connectToInjected, connectToTonkeeper, mockTonConnect } from 'src/connector';
import { useForceUpdate } from 'src/hooks/useForceUpdate';
import { useSlicedAddress } from 'src/hooks/useSlicedAddress';
import { useTonWallet } from 'src/hooks/useTonWallet';
import { Button, Dropdown, Menu, Modal, Space } from 'antd';
import { DownOutlined } from '@ant-design/icons';
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
    const isWalletInjected = connector.isInjectedProviderAvailable();
    const wallet = useTonWallet();

    const address = useSlicedAddress(wallet?.account.address);

    const handleButtonClick = useCallback(() => {
        if (connector.isInjectedProviderAvailable()) {
            connectToInjected();
            return;
        }

        const universalLink = connectToTonkeeper();

        if (isMobile()) {
            window.location.assign(universalLink);
        } else {
            setModalUniversalLink(universalLink);
        }
    }, []);

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
                        Connect Wallet { isWalletInjected ? '(Injected)' : '' }
                    </Button>
                }
                { !isWalletInjected && <Button type="link" onClick={() => {mockTonConnect(); forceUpdate()}}>Mock injected wallet</Button>}
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
