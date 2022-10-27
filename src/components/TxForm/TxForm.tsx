import { Button, Typography } from 'antd';
import ReactJson from 'react-json-view'
import React, { useCallback, useState } from 'react';
import { sendTransaction } from 'src/connector';
import { useTonWallet } from 'src/hooks/useTonWallet';
import './style.scss';
const { Title } = Typography;

const defaultTx = {
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

export function TxForm() {
    const [tx, setTx] = useState(defaultTx);
    const wallet = useTonWallet();

    const onChange = useCallback((value: object) =>
        setTx((value as { updated_src: typeof defaultTx}).updated_src),
        []
    );

    return (
        <div className="send-tx-form">
            <Title level={3}>Configure and send transaction</Title>
            <ReactJson src={defaultTx} theme="ocean" onEdit={onChange} onAdd={onChange} onDelete={onChange} />
            {
                wallet ?
                    <Button type="primary" shape="round" onClick={() => sendTransaction(tx)}>Send transaction</Button> :
                    <div className="send-tx-form__error">Connect wallet to send the transaction</div>
            }
        </div>
    )
}
