import React from 'react';
import { AuthButton } from 'src/components/AuthButton/AuthButton';
import './app.scss';

function App() {
  return (
    <div className="app">
        <header>
            <span>My Dapp</span>
            <AuthButton />
        </header>
        <main>

        </main>
    </div>
  );
}

export default App;
