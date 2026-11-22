import { useState } from "react";
import { Button, EmptyState, PageTitle, QR, Notice } from "../components/UI";
import { money, date } from "../utils/format";
export default function Tickets({ orders, events, onCancel, go }) {
  const [confirm, setConfirm] = useState(null);
  return (
    <>
      <PageTitle eyebrow="TUS RECUERDOS EMPIEZAN AQUÍ" title="Mis boletos">
        Conserva tu código y los detalles de tu experiencia.
      </PageTitle>
      {!orders.length ? (
        <EmptyState
          title="Aún no tienes boletos"
          action={
            <Button onClick={() => go("eventos")}>Descubrir eventos</Button>
          }
        >
          Tu próxima historia está por comenzar.
        </EmptyState>
      ) : (
        orders.map((o) => (
          <section className="order panel" key={o.id}>
            <div className="section-top">
              <div>
                <h2>Orden {o.id}</h2>
                <p>
                  {date(o.createdAt)} · {money(o.total)} · {o.status}
                </p>
              </div>
              {o.status === "Confirmada" && (
                <Button variant="outline" onClick={() => setConfirm(o.id)}>
                  Cancelar compra
                </Button>
              )}
            </div>
            {confirm === o.id && (
              <Notice type="error">
                ¿Cancelar esta compra simulada y liberar los boletos?{" "}
                <Button
                  onClick={() => {
                    onCancel(o.id);
                    setConfirm(null);
                  }}
                >
                  Sí, cancelar compra
                </Button>
                <Button variant="ghost" onClick={() => setConfirm(null)}>
                  Conservar
                </Button>
              </Notice>
            )}
            {o.items.flatMap((i) =>
              Array.from({ length: i.quantity }, (_, n) => {
                const event = events.find((e) => e.id === i.eventId);
                return (
                  <article
                    className={`ticket ${o.status === "Cancelada" ? "cancelled" : ""}`}
                    key={`${i.key}-${n}`}
                  >
                    <div>
                      <span className="eyebrow">
                        GLOBALTICKET · BOLETO DEMO
                      </span>
                      <h3>{event.title}</h3>
                      <p>
                        {date(event.date)}
                        <br />
                        {event.venue}
                      </p>
                      <strong>
                        {event.zones.find((z) => z.id === i.zoneId).name} ·
                        Admisión {n + 1}
                      </strong>
                      <p className="muted">
                        {o.id}-{i.key}-{n + 1}
                        <br />
                        Sin validez comercial
                      </p>
                    </div>
                    {o.status === "Confirmada" ? (
                      <QR
                        value={JSON.stringify({
                          type: "DEMO",
                          order: o.id,
                          event: event.id,
                          zone: i.zoneId,
                          ticket: n + 1,
                        })}
                      />
                    ) : (
                      <strong>CANCELADO</strong>
                    )}
                  </article>
                );
              }),
            )}
          </section>
        ))
      )}
    </>
  );
}
