import React, { useEffect } from 'react';
import { AppTitle } from 'src/components/AppTitle/AppTitle';
import { AuthButton } from 'src/components/AuthButton/AuthButton';
import './app.scss';
import { TxForm } from 'src/components/TxForm/TxForm';
import { connector } from 'src/connector';

function App() {
    useEffect(() => {
        console.log('Injected provider is available:', connector.isInjectedProviderAvailable());
        console.log('window.tonconnect is available:', !!(window as any).tonconnect);
        connector.autoConnect();
    }, []);

  return (
    <div className="app">
        <header>
            <AppTitle />
            <AuthButton />
        </header>
        <main>
            <TxForm />
        </main>
    </div>
  );
}

export default App;
