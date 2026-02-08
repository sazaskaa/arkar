/**
 * Componente raiz da aplicação.
 * Orquestra o fluxo principal: gerencia estado global (resultado, carregamento, erro),
 * integra o formulário de cálculo com a exibição de resultados, e controla
 * transições de sobreposição modal. Centro nevrálgico da lógica de apresentação.
 */
import { RotateCcw } from "lucide-react";
import { CalculatorForm } from "./components/CalculatorForm";
import { Header } from "./components/Header";
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
    handleCloseError,
  } = useCalculatorApp();

  return (
    <>
      <Header />
      <main className="app-content">
        <CalculatorForm onSubmit={handleCalculate} isLoading={isLoading} />
      </main>
      {error && (
        <ResultOverlay isClosing={isClosing} onClose={handleCloseError}>
          <section className="result-shell" aria-live="polite">
            <div className="result-section">
              <header className="result-header">
                <p className="eyebrow">Erro</p>
                <h2 className="result-title">Não foi possível calcular</h2>
                <p className="result-lead">{error}</p>
              </header>
              <button
                type="button"
                onClick={handleCloseError}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-800 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-900"
              >
                <RotateCcw className="h-4 w-4" strokeWidth={1.6} />
                Tentar novamente
              </button>
            </div>
          </section>
        </ResultOverlay>
      )}
      {result && (
        <ResultOverlay isClosing={isClosing} onClose={handleCloseResult}>
          <ResultDisplay result={result} input={lastInput} onClose={handleCloseResult} />
        </ResultOverlay>
      )}
    </>
  );
}

export default App;
