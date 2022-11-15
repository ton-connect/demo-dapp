import { Button, Typography } from "antd";
import ReactJson from "react-json-view";
import React, { useCallback, useState } from "react";
import { useTonWallet } from "src/hooks/useTonWallet";
import "./style.scss";
import { TonProofDemoApi } from "src/TonProofDemoApi";
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
      <Title level={3}>Demo backend with ton_proof verification</Title>
      {wallet ? (
        <Button type="primary" shape="round" onClick={handleClick}>
          Call TonProofDemoApi.getAccountInfo()
        </Button>
      ) : (
        <div className="ton-proof-demo__error">Connect wallet to call API</div>
      )}
      <ReactJson src={data} name="response" theme="ocean" />
    </div>
  );
}
