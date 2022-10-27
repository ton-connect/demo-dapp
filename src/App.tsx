import React from 'react';
import { AuthButton } from 'src/components/AuthButton/AuthButton';
import './app.scss';
import { TxForm } from 'src/components/TxForm/TxForm';

function App() {
  return (
    <div className="app">
        <header>
            <span>My Dapp</span>
            <AuthButton />
        </header>
        <main>
            <TxForm />
        </main>
    </div>
  );
}

export default App;
