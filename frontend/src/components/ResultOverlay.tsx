/**
 * Componente reutilizável para exibir overlays modais com animações.
 * Suporta fechamento via tecla Escape e clique no backdrop.
 * Usado para resultados de cálculo e mensagens de erro.
 */
import { useEffect, useCallback } from "react";
import type { ReactNode, MouseEvent } from "react";

interface ResultOverlayProps {
  children: ReactNode;
  isClosing: boolean;
  onClose?: () => void;
}

export function ResultOverlay({ children, isClosing, onClose }: ResultOverlayProps) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose?.();
    }
  };

  return (
    <div
      className={`result-overlay ${isClosing ? "result-overlay--closing" : ""}`}
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
    >
      {children}
    </div>
  );
}