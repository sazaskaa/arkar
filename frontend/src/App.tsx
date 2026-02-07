import { CalculatorForm } from "./components/CalculatorForm";

function App() {
  const handleSubmit = () => {
    // Integration comes next; for now we only validate local form input.
  };

  return <CalculatorForm onSubmit={handleSubmit} isLoading={false} />;
}

export default App;
