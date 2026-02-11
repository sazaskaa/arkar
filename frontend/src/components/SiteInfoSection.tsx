/**
 * Seção informativa abaixo do formulário, com explicação e FAQ.
 * Design enriquecido com animações, cards visuais e hierarquia clara.
 */
import { useEffect, useRef, useState } from "react";
import { Calculator, TrendingUp, FileText, CheckCircle2, HelpCircle, Shield } from "lucide-react";
import { FadeInOnScroll } from "./FadeInOnScroll";

export function SiteInfoSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [heights, setHeights] = useState<number[]>([]);
  const panelRefs = useRef<Array<HTMLDivElement | null>>([]);
  const faqItems = [
    {
      question: "O período de comparação realmente importa?",
      answer:
        "Sim. Ele define a janela temporal da análise. Comparar 24 meses vs 60 meses muda completamente o resultado. Alinhe com seu planejamento real.",
    },
    {
      question: "Isso substitui uma consultoria financeira?",
      answer:
        "Não. É uma ferramenta de apoio à decisão, não um serviço de consultoria. Use para explorar cenários e fundamentar conversas com especialistas.",
    },
    {
      question: "Posso testar vários cenários rapidamente?",
      answer:
        "Exatamente. Ajuste juros, entrada, prazo — cada mudança gera um novo resultado instantâneo. Compare múltiplas opções lado a lado.",
    },
  ];

  useEffect(() => {
    const newHeights = panelRefs.current.map((ref) => ref?.scrollHeight ?? 0);
    setHeights(newHeights);
  }, [openIndex]);
  return (
    <section id="entenda-o-processo" className="mx-auto mt-20 grid w-full max-w-[1080px] gap-16 pb-12">
      {/* Divisória decorativa */}
      <FadeInOnScroll>
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />
          </div>
          <div className="relative rounded-full bg-slate-100 px-5 py-2 dark:bg-slate-900/70">
            <span className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
              Entenda o processo
            </span>
          </div>
        </div>
      </FadeInOnScroll>

      {/* Como funciona - Grid assimétrico */}
      <FadeInOnScroll delay={200}>
        <div className="grid gap-8">
        <header className="mx-auto max-w-[680px] text-center">
          <p className="text-[0.72rem] uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
            Metodologia
          </p>
          <h2 className="mt-2 font-['Fraunces'] text-[clamp(2rem,3.5vw,2.8rem)] tracking-[-0.02em] text-slate-900 dark:text-slate-100">
            Números reais, decisões claras
          </h2>
          <p className="mt-4 text-[1.08rem] leading-relaxed text-slate-600 dark:text-slate-400">
            Transformamos valores de entrada em uma análise financeira estruturada.<br />
            Sem palpites, apenas matemática.
          </p>
        </header>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {/* Passo 1 */}
          <div className="group relative overflow-hidden rounded-[24px] border border-slate-200 bg-gradient-to-br from-white to-slate-50/80 p-6 shadow-[0_8px_24px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(15,23,42,0.12)] dark:border-slate-800 dark:from-slate-900 dark:to-slate-900/80 dark:shadow-[0_12px_32px_rgba(2,6,23,0.5)]">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-slate-900/[0.02] transition-transform duration-500 group-hover:scale-150 dark:bg-slate-50/[0.06]" />
            <div className="relative">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg dark:bg-slate-100 dark:text-slate-900">
                <Calculator className="h-6 w-6" strokeWidth={1.8} />
              </div>
              <div className="mb-3 font-['Fraunces'] text-[3rem] font-bold leading-none text-slate-200 dark:text-slate-700">
                01
              </div>
              <h3 className="mb-2 text-[1.05rem] font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                Entrada precisa
              </h3>
              <p className="text-[0.92rem] leading-relaxed text-slate-600 dark:text-slate-400">
                Preço do veículo, aluguel, taxa e prazo. Campos validados para evitar inconsistências.
              </p>
            </div>
          </div>

          {/* Passo 2 */}
          <div className="group relative overflow-hidden rounded-[24px] border border-slate-200 bg-gradient-to-br from-white to-slate-50/80 p-6 shadow-[0_8px_24px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(15,23,42,0.12)] dark:border-slate-800 dark:from-slate-900 dark:to-slate-900/80 dark:shadow-[0_12px_32px_rgba(2,6,23,0.5)]">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-slate-900/[0.02] transition-transform duration-500 group-hover:scale-150 dark:bg-slate-50/[0.06]" />
            <div className="relative">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg dark:bg-slate-100 dark:text-slate-900">
                <Shield className="h-6 w-6" strokeWidth={1.8} />
              </div>
              <div className="mb-3 font-['Fraunces'] text-[3rem] font-bold leading-none text-slate-200 dark:text-slate-700">
                02
              </div>
              <h3 className="mb-2 text-[1.05rem] font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                Modelo Price
              </h3>
              <p className="text-[0.92rem] leading-relaxed text-slate-600 dark:text-slate-400">
                Sistema de amortização padrão para financiamentos, com cálculo de juros compostos.
              </p>
            </div>
          </div>

          {/* Passo 3 */}
          <div className="group relative overflow-hidden rounded-[24px] border border-slate-200 bg-gradient-to-br from-white to-slate-50/80 p-6 shadow-[0_8px_24px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(15,23,42,0.12)] dark:border-slate-800 dark:from-slate-900 dark:to-slate-900/80 dark:shadow-[0_12px_32px_rgba(2,6,23,0.5)]">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-slate-900/[0.02] transition-transform duration-500 group-hover:scale-150 dark:bg-slate-50/[0.06]" />
            <div className="relative">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg dark:bg-slate-100 dark:text-slate-900">
                <TrendingUp className="h-6 w-6" strokeWidth={1.8} />
              </div>
              <div className="mb-3 font-['Fraunces'] text-[3rem] font-bold leading-none text-slate-200 dark:text-slate-700">
                03
              </div>
              <h3 className="mb-2 text-[1.05rem] font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                Projeção total
              </h3>
              <p className="text-[0.92rem] leading-relaxed text-slate-600 dark:text-slate-400">
                Soma de parcelas, entrada e valor residual ao longo do período definido.
              </p>
            </div>
          </div>

          {/* Passo 4 */}
          <div className="group relative overflow-hidden rounded-[24px] border border-slate-200 bg-gradient-to-br from-white to-slate-50/80 p-6 shadow-[0_8px_24px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(15,23,42,0.12)] dark:border-slate-800 dark:from-slate-900 dark:to-slate-900/80 dark:shadow-[0_12px_32px_rgba(2,6,23,0.5)]">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-slate-900/[0.02] transition-transform duration-500 group-hover:scale-150 dark:bg-slate-50/[0.06]" />
            <div className="relative">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg dark:bg-slate-100 dark:text-slate-900">
                <FileText className="h-6 w-6" strokeWidth={1.8} />
              </div>
              <div className="mb-3 font-['Fraunces'] text-[3rem] font-bold leading-none text-slate-200 dark:text-slate-700">
                04
              </div>
              <h3 className="mb-2 text-[1.05rem] font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                Relatório exportável
              </h3>
              <p className="text-[0.92rem] leading-relaxed text-slate-600 dark:text-slate-400">
                PDF estruturado com todos os valores, pronto para apresentar ou arquivar.
              </p>
            </div>
          </div>
        </div>
      </div>
      </FadeInOnScroll>

      {/* FAQ e Premissas - Layout side-by-side */}
      <FadeInOnScroll delay={400}>
        <div className="grid gap-8 lg:grid-cols-2">
        {/* FAQ */}
        <div className="grid gap-6">
          <header className="grid gap-2">
            <div className="inline-flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-slate-500 dark:text-slate-400" strokeWidth={1.8} />
              <p className="text-[0.72rem] uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">FAQ</p>
            </div>
            <h2 className="font-['Fraunces'] text-[clamp(1.6rem,2.5vw,2.2rem)] tracking-[-0.01em] text-slate-900 dark:text-slate-100">
              Perguntas frequentes
            </h2>
          </header>

          <div className="grid gap-4">
            {faqItems.map((item, index) => {
              const isOpen = openIndex === index;
              const panelHeight = heights[index] ?? 0;
              const panelId = `faq-panel-${index}`;
              const buttonId = `faq-button-${index}`;

              return (
                <div
                  key={item.question}
                  className="group rounded-[20px] border border-slate-200 bg-white/80 px-5 py-4 shadow-[0_4px_16px_rgba(15,23,42,0.04)] transition-all hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-[0_8px_24px_rgba(2,6,23,0.45)]"
                >
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex((prev) => (prev === index ? null : index))}
                    className="flex w-full cursor-pointer items-start justify-between gap-3 text-left text-[0.95rem] font-semibold text-slate-900 dark:text-slate-100"
                  >
                    <span>{item.question}</span>
                    <CheckCircle2
                      className={`mt-0.5 h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200 dark:text-slate-500 ${
                        isOpen ? "rotate-90" : ""
                      }`}
                      strokeWidth={1.8}
                    />
                  </button>
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    ref={(element) => {
                      panelRefs.current[index] = element;
                    }}
                    className="overflow-hidden"
                    style={{
                      maxHeight: isOpen ? `${panelHeight}px` : "0px",
                      opacity: isOpen ? 1 : 0,
                      transition: "max-height 240ms ease-in-out, opacity 240ms ease-in-out",
                    }}
                  >
                    <p className="mt-3 text-[0.9rem] leading-relaxed text-slate-600 dark:text-slate-400">
                      {item.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Premissas Técnicas */}
        <div className="grid gap-6">
          <header className="grid gap-2">
            <div className="inline-flex items-center gap-2">
              <Shield className="h-4 w-4 text-slate-500 dark:text-slate-400" strokeWidth={1.8} />
              <p className="text-[0.72rem] uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Transparência</p>
            </div>
            <h2 className="font-['Fraunces'] text-[clamp(1.6rem,2.5vw,2.2rem)] tracking-[-0.01em] text-slate-900 dark:text-slate-100">
              O que está incluso no cálculo
            </h2>
          </header>

          <div className="rounded-[24px] border border-slate-200 bg-gradient-to-br from-slate-50/60 to-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:from-slate-900/70 dark:to-slate-900/40 dark:shadow-[0_12px_32px_rgba(2,6,23,0.5)]">
            <ul className="grid gap-4">
              <li className="flex items-start gap-3">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900">
                  <span className="text-[0.7rem] font-bold">✓</span>
                </div>
                <div className="grid gap-1">
                  <h3 className="text-[0.95rem] font-semibold text-slate-900 dark:text-slate-100">Juros compostos mensais</h3>
                  <p className="text-[0.88rem] text-slate-600 dark:text-slate-400">
                    Taxa aplicada sobre o saldo devedor, método padrão em financiamentos brasileiros.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900">
                  <span className="text-[0.7rem] font-bold">✓</span>
                </div>
                <div className="grid gap-1">
                  <h3 className="text-[0.95rem] font-semibold text-slate-900 dark:text-slate-100">Valor residual teórico</h3>
                  <p className="text-[0.88rem] text-slate-600 dark:text-slate-400">
                    Estimativa de quanto o carro ainda vale ao final do período (depreciação linear simplificada).
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900">
                  <span className="text-[0.7rem] font-bold">✓</span>
                </div>
                <div className="grid gap-1">
                  <h3 className="text-[0.95rem] font-semibold text-slate-900 dark:text-slate-100">Custo total de aluguel acumulado</h3>
                  <p className="text-[0.88rem] text-slate-600 dark:text-slate-400">
                    Soma simples: valor mensal X número de meses. Sem considerar reajustes contratuais.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      </FadeInOnScroll>

      {/* Footer minimalista */}
      <FadeInOnScroll delay={600}>
        <div className="mx-auto max-w-[640px] text-center">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-slate-700" />
        <p className="mt-6 text-[0.88rem] leading-relaxed text-slate-500 dark:text-slate-400">
          Arkar - Projeto desenvolvido para demonstrar integração frontend-backend
        </p>
        </div>
      </FadeInOnScroll>
    </section>
  );
}
