/**
 * Componente reutilizável para exibir overlays modais com animações.
 * Usado para resultados de cálculo e mensagens de erro.
 */
import type { ReactNode } from "react";

interface ResultOverlayProps {
  children: ReactNode;
  isClosing: boolean;
}

export function ResultOverlay({ children, isClosing }: ResultOverlayProps) {
  return (
    <div
      className={`result-overlay ${isClosing ? "result-overlay--closing" : ""}`}
      role="dialog"
      aria-modal="true"
    >
      {children}
    </div>
  );
}