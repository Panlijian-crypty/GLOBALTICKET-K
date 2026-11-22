import { Button, EmptyState, Stepper, QuantityPicker } from "../components/UI";
import { money } from "../utils/format";
export function OrderSummary({ items, total }) {
  return (
    <aside className="panel summary">
      <h2>Resumen de compra</h2>
      {items.map((i) => (
        <div className="summary-line" key={i.key}>
          <span>
            {i.quantity} × {i.event.title}
            <small>{i.zone.name}</small>
          </span>
          <b>{money(i.quantity * i.zone.price)}</b>
        </div>
      ))}
      <div className="summary-line">
        <span>Cargos por servicio</span>
        <b>{money(0)}</b>
      </div>
      <div className="summary-total">
        <span>Total</span>
        <strong>{money(total)}</strong>
      </div>
      <p className="muted">USD · Entrega digital · Pago simulado</p>
    </aside>
  );
}
export default function Cart({
  items,
  total,
  onQuantity,
  onRemove,
  go,
  remaining,
}) {
  return (
    <>
      <Stepper step={0} />
      <h1>Tu próxima experiencia</h1>
      {!items.length ? (
        <EmptyState title="Tu carrito está esperando">
          Encuentra ese evento que no te quieres perder.
          <Button onClick={() => go("eventos")}>Explorar eventos</Button>
        </EmptyState>
      ) : (
        <div className="checkout-layout">
          <div>
            {items.map((i) => (
              <article className="cart-item panel" key={i.key}>
                <img src={i.event.image} alt={`Cartel de ${i.event.title}`} />
                <div>
                  <h2>{i.event.title}</h2>
                  <p>
                    {i.zone.name} · {money(i.zone.price)} por boleto
                  </p>
                  <QuantityPicker
                    value={i.quantity}
                    max={Math.min(10, remaining(i.event.id, i.zone.id))}
                    onChange={(q) => onQuantity(i.key, q)}
                  />
                  <Button variant="ghost" onClick={() => onRemove(i.key)}>
                    Eliminar
                  </Button>
                </div>
              </article>
            ))}
            <Button variant="ghost" onClick={() => go("eventos")}>
              Seguir explorando
            </Button>
          </div>
          <div>
            <OrderSummary items={items} total={total} />
            <Button className="wide" onClick={() => go("pago")}>
              Continuar con la compra
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
