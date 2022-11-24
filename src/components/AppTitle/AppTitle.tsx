import { CHAIN } from '@tonconnect/sdk';
import React, { useEffect, useRef, useState } from 'react';
import { Debugger } from 'src/components/AppTitle/Debugger/Debugger';
import { useTonWallet } from 'src/hooks/useTonWallet';
import './style.scss';

const chainNames = {
	[CHAIN.MAINNET]: 'mainnet',
	[CHAIN.TESTNET]: 'testnet',
};

export function AppTitle() {
	const wallet = useTonWallet();
	const debuggerRef = useRef<{ open: () => void }>();

	const [clicks, setClicks] = useState(0);

	useEffect(() => {
		if (clicks >= 5) {
			debuggerRef.current!.open();
			setClicks(0);
		}
	}, [clicks]);

	return (
		<>
			<div className="dapp-title" onClick={() => setClicks((x) => x + 1)}>
				<span className="dapp-title__text">My Dapp</span>
				{wallet && <span className="dapp-title__badge">{chainNames[wallet.account.chain]}</span>}
			</div>
			<Debugger ref={debuggerRef} />
		</>
	);
}
