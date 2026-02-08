import { useState } from "react";
import { CalculatorForm } from "./components/CalculatorForm";
import { ResultDisplay } from "./components/ResultDisplay";
import { calculateComparison } from "./services/api.service";
import type { CalculationInput, CalculationResult } from "./types/calculator.types";

const GENERIC_ERROR_MESSAGE = "Ocorreu um erro ao calcular. Tente novamente.";

function App() {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [lastInput, setLastInput] = useState<CalculationInput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  const handleCalculate = async (input: CalculationInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const nextResult = await calculateComparison(input);
      setLastInput(input);
      setResult(nextResult);
    } catch {
      setError(GENERIC_ERROR_MESSAGE);
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseResult = () => {
    setIsClosing(true);
    setTimeout(() => {
      setResult(null);
      setIsClosing(false);
    }, 300);
  };

  const handleCloseError = () => {
    setIsClosing(true);
    setTimeout(() => {
      setError(null);
      setIsClosing(false);
    }, 300);
  };

  return (
    <>
      <CalculatorForm onSubmit={handleCalculate} isLoading={isLoading} />
      {error && (
        <div className={`result-overlay ${isClosing ? "result-overlay--closing" : ""}`} role="dialog" aria-modal="true">
          <section className="result-shell" aria-live="polite">
            <div className="result-section">
              <header className="result-header">
                <p className="eyebrow">Erro</p>
                <h2 className="result-title">Não foi possível calcular</h2>
                <p className="result-lead">{error}</p>
              </header>
            </div>
          </section>
        </div>
      )}
      {result && (
        <div className={`result-overlay ${isClosing ? "result-overlay--closing" : ""}`} role="dialog" aria-modal="true">
          <ResultDisplay result={result} input={lastInput} onClose={handleCloseResult} />
        </div>
      )}
    </>
  );
}

export default App;
