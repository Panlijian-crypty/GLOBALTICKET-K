import { useState } from "react";
import { Button, Badge, QuantityPicker, Notice } from "../components/UI";
import { money, date } from "../utils/format";
export default function Detail({ event, remaining, onAdd, go }) {
  const [zone, setZone] = useState(event.zones[0].id);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const selected = event.zones.find((z) => z.id === zone);
  const available = remaining(event.id, zone);
  const canBuy = event.status !== "Próximamente" && available >= quantity;
  return (
    <>
      <Button variant="ghost" onClick={() => go("eventos")}>
        Volver a eventos
      </Button>
      <div className="detail-layout">
        <img
          className="detail-poster"
          src={event.image}
          alt={`Cartel de ${event.title}`}
        />
        <section>
          <Badge>{event.category}</Badge>
          <h1>{event.title}</h1>
          <p className="lead">{event.description}</p>
          <div className="event-facts">
            <p>
              <strong>Cuándo</strong>
              <br />
              {date(event.date)}
            </p>
            <p>
              <strong>Dónde</strong>
              <br />
              {event.venue}, {event.city}
            </p>
          </div>
          <div className="panel">
            <h2>Tu lugar, tu experiencia</h2>
            <fieldset className="zones">
              <legend>Selecciona una zona</legend>
              {event.zones.map((z) => (
                <label
                  key={z.id}
                  className={zone === z.id ? "zone active" : "zone"}
                >
                  <input
                    type="radio"
                    name="zona"
                    value={z.id}
                    checked={zone === z.id}
                    onChange={() => {
                      setZone(z.id);
                      setQuantity(1);
                    }}
                  />
                  <span>
                    <strong>{z.name}</strong>
                    <small>{remaining(event.id, z.id)} disponibles</small>
                  </span>
                  <b>{money(z.price)}</b>
                </label>
              ))}
            </fieldset>
            <div className="purchase-row">
              <QuantityPicker
                value={quantity}
                onChange={setQuantity}
                max={Math.min(10, available)}
              />
              <strong>{money(selected.price * quantity)}</strong>
            </div>
            <Button
              disabled={!canBuy}
              onClick={() => {
                const error = onAdd(event.id, zone, quantity);
                setMessage(error || "Boletos añadidos al carrito.");
              }}
            >
              {event.status === "Próximamente"
                ? "Venta próximamente"
                : available
                  ? "Añadir al carrito"
                  : "Zona agotada"}
            </Button>
            {message && (
              <Notice>
                {message}{" "}
                <Button variant="ghost" onClick={() => go("carrito")}>
                  Ver carrito
                </Button>
              </Notice>
            )}
            <p className="muted">
              Compra de demostración. No se realiza ningún cobro.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
