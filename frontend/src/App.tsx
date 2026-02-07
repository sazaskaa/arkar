import { useState } from "react";
import { CalculatorForm } from "./components/CalculatorForm";
import { ResultDisplay } from "./components/ResultDisplay";
import { calculateComparison } from "./services/api.service";
import type { CalculationInput, CalculationResult } from "./types/calculator.types";

const GENERIC_ERROR_MESSAGE = "Ocorreu um erro ao calcular. Tente novamente.";

function App() {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = async (input: CalculationInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const nextResult = await calculateComparison(input);
      setResult(nextResult);
    } catch {
      setError(GENERIC_ERROR_MESSAGE);
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <CalculatorForm onSubmit={handleCalculate} isLoading={isLoading} />
      {error && (
        <section className="result-shell" aria-live="polite">
          <div className="result-section">
            <header className="result-header">
              <p className="eyebrow">Erro</p>
              <h2 className="result-title">Nao foi possivel calcular</h2>
              <p className="result-lead">{error}</p>
            </header>
          </div>
        </section>
      )}
      {result && <ResultDisplay result={result} />}
    </>
  );
}

export default App;
