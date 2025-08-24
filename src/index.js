import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Importar override específico para o Render
import './config/render-override';

import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
