/**
 * Componente principal do formulário de cálculo do comparador Arkar.
 * Gerencia a entrada de dados do usuário para comparar custos de compra, financiamento e aluguel de carro.
 */
import { Car, Calendar, DollarSign, Percent, Clock, Repeat2, Calculator } from "lucide-react";
import type { CalculationInput } from "../types/calculator.types";
import { FormInputField } from "./FormInputField";
import { FormSectionHeader } from "./FormSectionHeader";
import { useCalculatorForm } from "../hooks/useCalculatorForm";

interface CalculatorFormProps {
  onSubmit: (data: CalculationInput) => void;
  isLoading: boolean;
}

export function CalculatorForm({ onSubmit, isLoading }: CalculatorFormProps) {
  const { formState, errors, handleChange, handleSubmit } = useCalculatorForm(onSubmit);

  return (
    <section className="mx-auto grid w-full max-w-[880px] gap-7">
      <header className="text-center animate-[fade-up_0.5s_ease_both]">
        <p className="text-[0.72rem] uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
          Comparador Arkar
        </p>
        <h1 className="my-2 font-['Fraunces'] text-[clamp(2.2rem,4vw,3.4rem)] tracking-[-0.02em] text-slate-900 dark:text-slate-100">
          Comprar, alugar ou financiar?
        </h1>
        <p className="text-[1.05rem] text-slate-500 dark:text-slate-400">
          Entenda o custo total de comprar, alugar ou financiar um carro e tome a melhor decisão para o seu momento
        </p>
      </header>

      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_28px_60px_rgba(15,23,42,0.12)] animate-[fade-up_0.6s_ease_both] [animation-delay:0.08s] dark:border-slate-800/80 dark:bg-slate-900/70 dark:shadow-[0_28px_60px_rgba(2,6,23,0.55)]">
        <form className="grid gap-6 p-[30px]" onSubmit={handleSubmit} noValidate>
          <div className="grid gap-4">
            <FormSectionHeader
              title="Dados do veículo"
              icon={<Car className="h-4 w-4" strokeWidth={1.6} />}
            />
            <div className="grid gap-5 md:grid-cols-2">
              <FormInputField
                id="carPrice"
                name="carPrice"
                type="text"
                label="Valor do carro (R$)"
                placeholder="Ex: 120.000"
                value={formState.carPrice}
                onChange={handleChange}
                error={errors.carPrice}
                prefix="R$"
              />
              <FormInputField
                id="monthlyRent"
                name="monthlyRent"
                type="text"
                label="Aluguel mensal (R$)"
                placeholder="Ex: 2.500"
                value={formState.monthlyRent}
                onChange={handleChange}
                error={errors.monthlyRent}
                icon={<Calendar className="h-4 w-4" strokeWidth={1.6} />}
              />
            </div>
          </div>

          <div className="h-px w-full bg-slate-200 dark:bg-slate-800" aria-hidden="true" />

          <div className="grid gap-4">
            <FormSectionHeader
              title="Detalhes do financiamento"
              icon={<DollarSign className="h-4 w-4" strokeWidth={1.6} />}
            />
            <div className="grid gap-5 md:grid-cols-2">
              <FormInputField
                id="interestRate"
                name="interestRate"
                type="number"
                step="0.01"
                label="Taxa de juros (% a.m.)"
                placeholder="Ex: 1.5"
                value={formState.interestRate}
                onChange={handleChange}
                error={errors.interestRate}
                icon={<Percent className="h-4 w-4" strokeWidth={1.6} />}
              />
              <FormInputField
                id="financingTerm"
                name="financingTerm"
                type="number"
                step="1"
                label="Prazo do financiamento (meses)"
                placeholder="Ex: 48"
                value={formState.financingTerm}
                onChange={handleChange}
                error={errors.financingTerm}
                icon={<Clock className="h-4 w-4" strokeWidth={1.6} />}
              />
            </div>
          </div>

          <div className="rounded-[18px] border border-slate-200 bg-slate-100/60 p-4 dark:border-slate-800 dark:bg-slate-900/60">
            <div className="grid gap-5 md:grid-cols-2">
              <FormInputField
                id="downPayment"
                name="downPayment"
                type="text"
                label="Entrada (R$)"
                placeholder="Ex: 10.000"
                value={formState.downPayment}
                onChange={handleChange}
                error={errors.downPayment}
                prefix="R$"
                optionalLabel="Opcional"
              />
              <FormInputField
                id="comparisonPeriod"
                name="comparisonPeriod"
                type="number"
                step="1"
                label="Período de comparação (meses)"
                placeholder="Ex: 48"
                value={formState.comparisonPeriod}
                onChange={handleChange}
                error={errors.comparisonPeriod}
                icon={<Repeat2 className="h-4 w-4" strokeWidth={1.6} />}
                optionalLabel="OPCIONAL"
              />
            </div>
          </div>

          <div className="grid gap-3">
            <button
              className="inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-slate-800 px-5 py-4 text-base font-semibold text-white shadow-[0_18px_30px_rgba(17,24,39,0.2)] transition hover:-translate-y-0.5 hover:bg-slate-900 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none disabled:transform-none dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-white dark:shadow-[0_18px_30px_rgba(15,23,42,0.35)]"
              type="submit"
              disabled={isLoading}
            >
              <span className="h-5 w-5 text-white/70" aria-hidden="true">
                <Calculator className="h-5 w-5" strokeWidth={1.6} />
              </span>
              {isLoading ? "Calculando..." : "Calcular"}
            </button>
            <p className="text-center text-[0.85rem] text-slate-500 dark:text-slate-400">
              Análise objetiva baseada nos custos de compra, financiamento e aluguel
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
