import { Button, Typography } from 'antd';
import React, { useCallback, useState } from 'react';
import ReactJson from 'react-json-view';
import { useTonWallet } from 'src/hooks/useTonWallet';
import { TonProofDemoApi } from 'src/TonProofDemoApi';
import './style.scss';

const { Title } = Typography;

export function TonProofDemo() {
	const [data, setData] = useState({});
	const wallet = useTonWallet();

	const handleClick = useCallback(async () => {
		if (!wallet) {
			return;
		}
		const response = await TonProofDemoApi.getAccountInfo(wallet.account);

		setData(response);
	}, [wallet]);

	if (!wallet) {
		return null;
	}

	return (
		<div className="ton-proof-demo">
			<Title level={3}>Demo backend API with ton_proof verification</Title>
			{wallet ? (
				<Button type="primary" shape="round" onClick={handleClick}>
					Call backend getAccountInfo()
				</Button>
			) : (
				<div className="ton-proof-demo__error">Connect wallet to call API</div>
			)}
			<ReactJson src={data} name="response" theme="ocean" />
		</div>
	);
}
