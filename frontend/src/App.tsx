/**
 * Componente raiz da aplicação.
 * Orquestra o fluxo principal: gerencia estado global (resultado, carregamento, erro),
 * integra o formulário de cálculo com a exibição de resultados, e controla
 * transições de sobreposição modal. Centro nevrálgico da lógica de apresentação.
 */
import { RotateCcw } from "lucide-react";
import { Route, Routes } from "react-router-dom";
import { CalculatorForm } from "./components/CalculatorForm";
import { Header } from "./components/Header";
import NotFound from "./components/NotFound";
import { ResultDisplay } from "./components/ResultDisplay";
import { ResultOverlay } from "./components/ResultOverlay";
import { SiteInfoSection } from "./components/SiteInfoSection";
import { useCalculatorApp } from "./hooks/useCalculatorApp";
import { useTheme } from "./hooks/useTheme";
import { useLenis } from "./hooks/useLenis";

function App() {
  const { theme, toggleTheme } = useTheme();
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

  useLenis();

  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <Header theme={theme} onToggleTheme={toggleTheme} />
            <main className="app-content">
              <CalculatorForm onSubmit={handleCalculate} isLoading={isLoading} />
              <SiteInfoSection />
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
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-800 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-900 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-white"
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
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
