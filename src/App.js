import React, { useEffect } from 'react';

function App() {
  useEffect(() => {
    // Log para debug
    console.log('🚀 App.js carregado com sucesso!');
    console.log('📍 URL atual:', window.location.href);
    console.log('🌍 User Agent:', navigator.userAgent);
    
    // Verificar se o DOM está funcionando
    const rootElement = document.getElementById('root');
    if (rootElement) {
      console.log('✅ Elemento root encontrado:', rootElement);
    } else {
      console.error('❌ Elemento root NÃO encontrado!');
    }
  }, []);

  // Função de teste
  const handleTestClick = () => {
    alert('🎉 JavaScript está funcionando perfeitamente!');
    console.log('🎯 Clique funcionou!');
  };

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
      marginTop: '50px',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#333', marginBottom: '20px' }}>🚀 Teste de Deploy - Render</h1>
      
      <div style={{ 
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: '#e8f5e8',
        borderRadius: '10px',
        border: '2px solid #4CAF50'
      }}>
        <h2 style={{ color: '#4CAF50', marginBottom: '15px' }}>✅ Status: Funcionando</h2>
        <p style={{ marginBottom: '10px' }}>Timestamp: {new Date().toLocaleString('pt-BR')}</p>
        <p style={{ marginBottom: '10px' }}>URL: {window.location.href}</p>
        <p>Se você está vendo esta mensagem, o deploy está funcionando!</p>
      </div>

      <div style={{ 
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: '#fff3cd',
        borderRadius: '10px',
        border: '2px solid #ffc107'
      }}>
        <h3 style={{ color: '#856404', marginBottom: '15px' }}>🧪 Teste de Funcionalidade</h3>
        <button 
          onClick={handleTestClick}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Clique Aqui para Testar JavaScript
        </button>
      </div>

      <div style={{ 
        padding: '20px',
        backgroundColor: '#d1ecf1',
        borderRadius: '10px',
        border: '2px solid #17a2b8'
      }}>
        <h3 style={{ color: '#0c5460', marginBottom: '15px' }}>📊 Informações do Sistema</h3>
        <p>React Version: {React.version}</p>
        <p>Node Environment: {process.env.NODE_ENV}</p>
        <p>Build Time: {new Date().toISOString()}</p>
      </div>
    </div>
  );
}

export default App;
