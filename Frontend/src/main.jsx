// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

console.log('1. main.jsx chargé');

const root = document.getElementById('root');
console.log('2. Élément root:', root);

if (!root) {
  console.error('❌ Élément #root introuvable dans index.html');
} else {
  console.log('3. Création du root React');
  try {
    ReactDOM.createRoot(root).render(
      <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.StrictMode>
    );
    console.log('4. ✅ Application rendue avec succès');
  } catch (error) {
    console.error('❌ Erreur lors du rendu:', error);
  }
}