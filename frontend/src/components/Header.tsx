/**
 * Header minimalista com logo e nome da marca.
 */
export function Header() {
  return (
    <header className="site-header" role="banner">
      <div className="site-header__inner">
        <div className="site-header__brand" aria-label="Arkar">
          <img className="site-header__logo" src="/logo-arkar.png" alt="Logo Arkar" />
          <span className="site-header__name">Arkar</span>
        </div>
        <nav className="site-header__nav">
          <a href="#entenda-o-processo" className="site-header__link">
            Entenda o processo
          </a>
        </nav>
      </div>
    </header>
  );
}
