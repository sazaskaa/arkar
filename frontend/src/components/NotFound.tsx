import React from 'react';
import './NotFound.css';

const NotFound: React.FC = () => {
  return (
    <div className="bsod-wrapper">
      <main className="bsod bsod-container">
        <h1 className="neg title">
          <span className="bg">Error - 404</span>
        </h1>
        <p>Oops! Parece que você pegou um desvio inesperado. Para continuar:</p>
        <p>
          * Retorne para a página principal.<br />
          * Tente novamente mais tarde.
        </p>
        <nav className="nav">
          <a href="/" className="link">Home</a>&nbsp;|&nbsp;<a href="/" className="link">Arkar</a>
        </nav>
      </main>
    </div>
  );
};

export default NotFound;