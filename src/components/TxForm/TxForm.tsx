import { SendTransactionRequest } from '@tonconnect/sdk';
import { Button, Typography } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import ReactJson from 'react-json-view';
import { useRecoilValueLoadable } from 'recoil';
import { connector, sendTransaction } from 'src/connector';
import { useTonWallet } from 'src/hooks/useTonWallet';
import { callToBase64, generateContractAddress, generateInitialData } from 'src/nft-transaction';
import { walletsListQuery } from 'src/state/wallets-list';
import './style.scss';

const { Title } = Typography;

export function TxForm() {
	const [tx, setTx] = useState<SendTransactionRequest | null>(null);
	const wallet = useTonWallet();
	const walletsList = useRecoilValueLoadable(walletsListQuery);

	useEffect(() => {
		if (wallet) {
			const data = generateInitialData(connector.wallet!.account.address);
			const contractAddress = generateContractAddress(data);
			const dataString = callToBase64(data);

			setTx(() => ({
				valid_until: Date.now() + 1000000,
				messages: [
					{
						address: contractAddress,
						amount: '200000000',
						initState: dataString,
					},
					{
						address: '0:E69F10CC84877ABF539F83F879291E5CA169451BA7BCE91A37A5CED3AB8080D3',
						amount: '60000000',
					},
				],
			}));
		} else {
			setTx(null);
		}
	}, [wallet]);

	const onChange = useCallback(
		(value: object) => setTx((value as { updated_src: SendTransactionRequest }).updated_src),
		[],
	);

	return (
		<div className="send-tx-form">
			<Title level={3}>Configure and send transaction</Title>

			{wallet && tx ? (
				<>
					<ReactJson src={tx} theme="ocean" onEdit={onChange} onAdd={onChange} onDelete={onChange} />
					<Button type="primary" shape="round" onClick={() => sendTransaction(tx, walletsList.contents.walletsList[0])}>
						Send transaction
					</Button>
				</>
			) : (
				<div className="send-tx-form__error">Connect wallet to send the transaction</div>
			)}
		</div>
	);
}
