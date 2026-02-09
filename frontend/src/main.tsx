/**
 * Ponto de entrada da aplicação React.
 * Inicializa o React DOM, monta o componente App no elemento raiz do HTML,
 * carrega estilos globais e ativa o modo StrictMode para detectar problemas em desenvolvimento.
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
