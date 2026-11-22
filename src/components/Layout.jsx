import { Button } from "./UI";
export function Header({ view, go, cartCount, session, theme, setTheme }) {
  return (
    <header className="site-header">
      <a className="brand" href="#eventos" onClick={() => go("eventos")}>
        <span className="brand-mark" aria-hidden="true">
          G
        </span>
        GLOBAL<span>TICKET</span>
      </a>
      <nav aria-label="Navegación principal">
        <a
          className={view === "eventos" ? "selected" : ""}
          href="#eventos"
          onClick={() => go("eventos")}
        >
          Explorar
        </a>
        <a href="#boletos" onClick={() => go("boletos")}>
          Mis boletos
        </a>
        {session && session.role !== "Cliente" && (
          <a href="#admin" onClick={() => go("admin")}>
            Administración
          </a>
        )}
      </nav>
      <div className="header-actions">
        <Button
          variant="ghost icon"
          aria-label={
            theme === "dark" ? "Activar tema claro" : "Activar tema oscuro"
          }
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? "☀" : "☾"}
        </Button>
        <Button variant="ghost" onClick={() => go("carrito")}>
          Carrito <span className="count">{cartCount}</span>
        </Button>
        <Button variant="outline" onClick={() => go("cuenta")}>
          {session ? session.name.split(" ")[0] : "Mi cuenta"}
        </Button>
      </div>
    </header>
  );
}
export function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <strong>GLOBALTICKET</strong>
        <p>
          Un click y experiencia inolvidable con tus favoritos es nuestro
          objetivo.
        </p>
      </div>
      <p>
        Proyecto académico · Grupo K<br />
        Todos los eventos y las compras son simulados.
      </p>
    </footer>
  );
}
