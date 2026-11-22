import { useEffect, useState } from "react";
import { Button, Field, EmptyState, Notice } from "../components/UI";
import EventCard from "../components/EventCard";
export default function Catalog({
  events,
  onOpen,
  category,
  setCategory,
  onReset,
}) {
  const [query, setQuery] = useState("");
  const [state, setState] = useState("loading");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => setState("ready"), 500);
    return () => clearTimeout(timer);
  }, [attempt]);
  const shown = events.filter(
    (e) =>
      (category === "Todos" || e.category === category) &&
      `${e.title} ${e.venue} ${e.city}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">
            EL SALVADOR · EXPERIENCIAS QUE CONECTAN
          </span>
          <h1>
            Hay momentos
            <br />
            que se <em>viven.</em>
          </h1>
          <p>
            Tu próxima gran historia empieza aquí.
            <br />
            Descubre eventos, elige tu lugar y disfruta.
          </p>
          <Button
            onClick={() =>
              document
                .getElementById("catalogo")
                .scrollIntoView({ behavior: "smooth" })
            }
          >
            Encuentra tu experiencia
          </Button>
          <div className="hero-note">
            Música, arte y mucho más, en un solo lugar.
          </div>
        </div>
        <div className="hero-art">
          <img
            src="./posters/neon.svg"
            alt="Neon Nights: un festival de luces y música"
          />
          <div className="hero-ticket">
            <span>PRÓXIMA PARADA</span>
            <strong>Neon Nights</strong>
            <small>12 DIC · Parque Bicentenario</small>
          </div>
        </div>
      </section>
      <section id="catalogo" className="catalog">
        <div className="section-top">
          <div>
            <span className="eyebrow">HAZ ESPACIO EN TU AGENDA</span>
            <h2>Descubre lo que viene</h2>
          </div>
          <span className="muted">{shown.length} experiencias para ti</span>
        </div>
        <div className="filter-row">
          <Field label="Buscar eventos">
            <input
              type="search"
              placeholder="Evento, lugar o ciudad…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </Field>
          <Field label="Categoría">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {["Todos", ...new Set(events.map((e) => e.category))].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Field>
        </div>
        {state === "loading" ? (
          <div className="loading" role="status">
            Preparando tus próximas experiencias…
          </div>
        ) : state === "error" ? (
          <Notice type="error">
            No se pudo cargar el catálogo.{" "}
            <Button
              onClick={() => {
                setState("loading");
                setAttempt((a) => a + 1);
              }}
            >
              Reintentar
            </Button>
          </Notice>
        ) : shown.length ? (
          <div className="event-grid">
            {shown.map((e) => (
              <EventCard key={e.id} event={e} onOpen={onOpen} />
            ))}
          </div>
        ) : (
          <EmptyState title="No encontramos eventos">
            Prueba otra búsqueda o categoría.
          </EmptyState>
        )}
        <details className="demo-tools">
          <summary>Opciones de demostración</summary>
          <Button variant="ghost" onClick={() => setState("error")}>
            Simular error de carga
          </Button>
          <Button variant="outline" onClick={onReset}>
            Reiniciar demostración
          </Button>
          <p>
            Catálogo ficticio para fines académicos. Las fechas, lugares y
            precios no constituyen una oferta real.
          </p>
        </details>
      </section>
      <section className="closing">
        <span className="eyebrow">MENOS FILAS. MÁS RECUERDOS.</span>
        <h2>Elige. Confirma. Vive.</h2>
        <p>Tus experiencias favoritas, siempre a mano.</p>
      </section>
    </>
  );
}
