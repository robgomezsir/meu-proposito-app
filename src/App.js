import React from 'react';
import SistemaProposito from './components/SistemaProposito';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <SistemaProposito />
    </AuthProvider>
  );
}

export default App;
