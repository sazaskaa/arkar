/**
 * Ponto de entrada da aplicação React.
 * Inicializa o React DOM, monta o componente App no elemento raiz do HTML,
 * carrega estilos globais e ativa o modo StrictMode para detectar problemas em desenvolvimento.
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
