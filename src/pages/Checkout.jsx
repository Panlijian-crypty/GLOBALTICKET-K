import { useState } from "react";
import { Button, Field, Notice, Stepper, EmptyState } from "../components/UI";
import { OrderSummary } from "./Cart";
import { emailValid } from "../utils/format";
import { useDelayedAction } from "../hooks/useDelayedAction";

export default function Checkout({ items, total, session, onComplete, go }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    name: session?.name || "Cliente Demo",
    email: session?.email || "cliente@example.com",
    method: "aprobado",
  });
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState("");
  const { busy, run } = useDelayedAction(850);
  const set = (key, value) =>
    setData((current) => ({ ...current, [key]: value }));

  function submit(event) {
    event.preventDefault();
    if (busy) return;
    setError("");
    const normalized = {
      ...data,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
    };
    if (normalized.name.length < 2 || !emailValid(normalized.email)) {
      setError(
        "Ingresa un nombre de al menos dos caracteres y un correo válido.",
      );
      return;
    }
    if (step === 1) {
      setData(normalized);
      setStep(2);
      return;
    }
    if (!accepted) {
      setError("Confirma que comprendes que esta compra es de demostración.");
      return;
    }
    run(() => {
      if (normalized.method === "rechazado") {
        setError(
          "Pago de prueba rechazado. Elige la tarjeta de prueba aprobada y reintenta.",
        );
      } else {
        const result = onComplete(normalized);
        if (result) setError(result);
        else setStep(3);
      }
    });
  }

  if (step === 3)
    return (
      <>
        <Stepper step={3} />
        <EmptyState title="¡Tu experiencia ya tiene lugar!">
          La compra simulada se completó. Tus boletos y códigos QR están listos.
        </EmptyState>
        <div className="center">
          <Button onClick={() => go("boletos")}>Ver mis boletos</Button>
        </div>
      </>
    );
  if (!items.length)
    return (
      <EmptyState
        title="No hay boletos en tu carrito"
        action={<Button onClick={() => go("eventos")}>Explorar eventos</Button>}
      />
    );
  return (
    <>
      <Stepper step={step} />
      <h1>
        {step === 1
          ? "¿Para quién es la experiencia?"
          : "Todo listo para confirmar"}
      </h1>
      <div className="checkout-layout">
        <form
          className="panel form"
          aria-label="Proceso de compra"
          aria-busy={busy}
          noValidate
          onSubmit={submit}
        >
          <Notice>
            Demostración académica: utiliza datos ficticios. No ingreses
            información bancaria real.
          </Notice>
          {error && <Notice type="error">{error}</Notice>}
          {step === 1 ? (
            <>
              <Field
                label="Nombre de prueba"
                name="name"
                required
                minLength={2}
                disabled={busy}
                value={data.name}
                onChange={(event) => set("name", event.target.value)}
              />
              <Field
                label="Correo de prueba"
                name="email"
                type="email"
                required
                disabled={busy}
                value={data.email}
                onChange={(event) => set("email", event.target.value)}
              />
              <p className="muted">No se enviarán correos.</p>
            </>
          ) : (
            <>
              <h2>Pago simulado</h2>
              <Field label="Tarjeta de prueba">
                <select
                  disabled={busy}
                  value={data.method}
                  onChange={(event) => set("method", event.target.value)}
                >
                  <option value="aprobado">DEMO 4242 · Pago aprobado</option>
                  <option value="rechazado">DEMO 0000 · Simular rechazo</option>
                </select>
              </Field>
              <p>
                Comprador: {data.name}
                <br />
                {data.email}
              </p>
              <label className="check">
                <input
                  type="checkbox"
                  required
                  disabled={busy}
                  checked={accepted}
                  onChange={(event) => setAccepted(event.target.checked)}
                />
                Entiendo que los boletos son de demostración y no tienen
                validez.
              </label>
            </>
          )}
          <div className="form-actions">
            <Button
              type="button"
              variant="ghost"
              disabled={busy}
              onClick={() => (step === 1 ? go("carrito") : setStep(1))}
            >
              Volver
            </Button>
            <Button type="submit" disabled={busy}>
              {busy
                ? "Procesando…"
                : step === 1
                  ? "Continuar al pago"
                  : "Confirmar pago simulado"}
            </Button>
          </div>
        </form>
        <OrderSummary items={items} total={total} />
      </div>
    </>
  );
}
