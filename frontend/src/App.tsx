/**
 * Componente raiz da aplicação.
 * Orquestra o fluxo principal: gerencia estado global (resultado, carregamento, erro),
 * integra o formulário de cálculo com a exibição de resultados, e controla
 * transições de sobreposição modal. Centro nevrálgico da lógica de apresentação.
 */
import { CalculatorForm } from "./components/CalculatorForm";
import { ResultDisplay } from "./components/ResultDisplay";
import { ResultOverlay } from "./components/ResultOverlay";
import { useCalculatorApp } from "./hooks/useCalculatorApp";

function App() {
  const {
    result,
    lastInput,
    isLoading,
    error,
    isClosing,
    handleCalculate,
    handleCloseResult,
  } = useCalculatorApp();

  return (
    <>
      <CalculatorForm onSubmit={handleCalculate} isLoading={isLoading} />
      {error && (
        <ResultOverlay isClosing={isClosing}>
          <section className="result-shell" aria-live="polite">
            <div className="result-section">
              <header className="result-header">
                <p className="eyebrow">Erro</p>
                <h2 className="result-title">Não foi possível calcular</h2>
                <p className="result-lead">{error}</p>
              </header>
            </div>
          </section>
        </ResultOverlay>
      )}
      {result && (
        <ResultOverlay isClosing={isClosing}>
          <ResultDisplay result={result} input={lastInput} onClose={handleCloseResult} />
        </ResultOverlay>
      )}
    </>
  );
}

export default App;
