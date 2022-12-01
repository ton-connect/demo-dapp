import { SendTransactionRequest } from '@tonconnect/sdk';
import { Button, Input, Typography } from 'antd';
import cn from 'classnames';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactJson from 'react-json-view';
import { useRecoilValueLoadable } from 'recoil';
import { connector, sendTransaction } from 'src/connector';
import { useTonWallet } from 'src/hooks/useTonWallet';
import { generatePayload, getAddressAndStateInit, getRawAddress } from 'src/nft-transaction';
import { walletsListQuery } from 'src/state/wallets-list';
import { Address } from 'ton';
import './style.scss';

const { Title } = Typography;

export function TxForm() {
	const [tx, setTx] = useState<SendTransactionRequest | null>(null);
	const [sendTo, setSendTo] = useState<string>('');
	const [addressError, setAddressError] = useState<boolean>(false);
	const wallet = useTonWallet();
	const walletsList = useRecoilValueLoadable(walletsListQuery);

	const removeTxMessage = useCallback(() => {
		if (tx && tx.messages.length === 2) {
			setTx(
				(value) =>
					({
						...value,
						messages: value!.messages.slice(1),
					} as SendTransactionRequest),
			);
		}
	}, [tx]);

	useEffect(() => {
		if (wallet) {
			const { address, stateInit } = getAddressAndStateInit(connector.wallet!.account.address);

			const tx = {
				validUntil: Date.now() + 1000000,
				messages: [
					{
						address,
						amount: '100000000',
						stateInit,
					},
				],
			};

			setTx(tx);
		} else {
			setTx(null);
			setSendTo('');
		}
	}, [wallet]);

	useEffect(() => {
		if (sendTo) {
			let isCorrect;
			try {
				Address.parseFriendly(sendTo);
				isCorrect = true;
			} catch (e) {
				isCorrect = false;
			}

			if (!isCorrect) {
				setAddressError(true);
				removeTxMessage();
				return;
			}

			setAddressError(false);
			const payload = generatePayload(sendTo);

			setTx(
				(value) =>
					({
						...value,
						messages: [...value!.messages].concat({
							address: value!.messages[0].address,
							amount: '50000000',
							payload,
						}),
					} as SendTransactionRequest),
			);
		} else {
			setAddressError(false);
			removeTxMessage();
		}
	}, [sendTo]);

	const onChange = useCallback(
		(value: object) => setTx((value as { updated_src: SendTransactionRequest }).updated_src),
		[],
	);

	return (
		<div className="send-tx-form">
			<Title level={3}>Configure and send transaction</Title>

			{wallet && tx ? (
				<>
					<Title level={4}>Create NFT and send to the friend</Title>
					<div className="send-tx-wrapper">
						<div className="send-tx-input-wrapper">
							(Optional) Send NFT to (user friendly address):
							<Input value={sendTo} onChange={(e) => setSendTo(e.target.value)}></Input>
							<span className={cn('send-tx-input-wrapper-error', { 'send-tx-input-wrapper-error_show': addressError })}>
								Wrong address
							</span>
						</div>
						<ReactJson src={tx} theme="ocean" onEdit={onChange} onAdd={onChange} onDelete={onChange} />
						<Button
							type="primary"
							shape="round"
							disabled={addressError}
							onClick={() => sendTransaction(tx, walletsList.contents.walletsList[0])}
						>
							Send transaction
						</Button>
					</div>
				</>
			) : (
				<div className="send-tx-form__error">Connect wallet to send the transaction</div>
			)}
		</div>
	);
}
