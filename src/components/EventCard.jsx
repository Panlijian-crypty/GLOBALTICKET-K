import { Badge, Button } from "./UI";
import { money, date } from "../utils/format";
export default function EventCard({ event, onOpen }) {
  return (
    <article className="event-card">
      <button
        className="poster-link"
        onClick={() => onOpen(event.id)}
        aria-label={`Ver ${event.title}`}
      >
        <img
          src={event.image}
          alt={`Cartel ilustrado de ${event.title}`}
          loading="lazy"
        />
        <Badge>{event.category}</Badge>
      </button>
      <div className="event-content">
        <div className="meta">{date(event.date)}</div>
        <h3>{event.title}</h3>
        <p>
          {event.venue} · {event.city}
        </p>
        <span
          className={`event-status ${event.status === "Agotado" ? "sold" : ""}`}
        >
          {event.status}
        </span>
        <div className="card-bottom">
          <span>
            Desde <strong>{money(event.base)}</strong>
          </span>
          <Button variant="outline" onClick={() => onOpen(event.id)}>
            Ver evento
          </Button>
        </div>
      </div>
    </article>
  );
}
