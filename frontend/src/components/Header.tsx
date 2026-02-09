/**
 * Header minimalista com logo e nome da marca.
 */
import { Moon, Sun } from "lucide-react";

interface HeaderProps {
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

export function Header({ theme, onToggleTheme }: HeaderProps) {
  const isDark = theme === "dark";
  const ThemeIcon = isDark ? Sun : Moon;
  const themeLabel = isDark ? "Ativar modo claro" : "Ativar modo escuro";

  return (
    <header className="site-header" role="banner">
      <div className="site-header__inner">
        <div className="site-header__brand" aria-label="Arkar">
          <img className="site-header__logo" src={isDark ? "/logo-arkar-white.png" : "/logo-arkar.png"} alt="Logo Arkar" />
          <span className="site-header__name">Arkar</span>
        </div>
        <nav className="site-header__nav">
          <a href="#entenda-o-processo" className="site-header__link">
            Entenda o processo
          </a>
          <button
            type="button"
            className="site-header__theme-toggle"
            onClick={onToggleTheme}
            aria-pressed={isDark}
            aria-label={themeLabel}
            title={themeLabel}
          >
            <ThemeIcon className="h-4 w-4" strokeWidth={1.8} />
          </button>
        </nav>
      </div>
    </header>
  );
}
