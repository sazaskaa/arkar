/**
 * Componente wrapper que anima fade-in ao entrar no viewport.
 * Usa IntersectionObserver para detectar quando elemento fica visível.
 */
import type { ReactNode } from "react";
import { useInView } from "../hooks/useInView";

interface FadeInOnScrollProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
}

export function FadeInOnScroll({ children, delay = 0, duration = 600 }: FadeInOnScrollProps) {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  return (
    <div
      ref={ref}
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? "translateY(0)" : "translateY(12px)",
        transition: `opacity ${duration}ms ease ${delay}ms, transform ${duration}ms ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
