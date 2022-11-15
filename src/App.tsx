import React, { useEffect } from "react";
import { AppTitle } from "src/components/AppTitle/AppTitle";
import { AuthButton } from "src/components/AuthButton/AuthButton";
import "./app.scss";
import { TxForm } from "src/components/TxForm/TxForm";
import { connector } from "src/connector";
import { TonProofDemo } from "./components/TonProofDemo/TonProofDemo";

function App() {
  useEffect(() => {
    connector.restoreConnection();
  }, []);

  return (
    <div className="app">
      <header>
        <AppTitle />
        <AuthButton />
      </header>
      <main>
        <TxForm />
        <TonProofDemo />
      </main>
    </div>
  );
}

export default App;
