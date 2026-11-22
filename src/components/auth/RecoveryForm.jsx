import { useState } from "react";
import { Button, Field, Notice } from "../UI";
import { emailValid } from "../../utils/format";
import { useDelayedAction } from "../../hooks/useDelayedAction";

export default function RecoveryForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const { busy, run } = useDelayedAction();
  function submit(event) {
    event.preventDefault();
    if (busy) return;
    setError("");
    setMessage("");
    if (!emailValid(email.trim())) return setError("Ingresa un correo válido.");
    run(() =>
      setMessage("Solicitud simulada completada. No se envió ningún correo."),
    );
  }
  return (
    <form
      className="form"
      aria-label="Recuperar contraseña"
      aria-busy={busy}
      noValidate
      onSubmit={submit}
    >
      <Notice>
        Esta pantalla demuestra el flujo de recuperación. No cambia contraseñas
        ni envía correos.
      </Notice>
      {error && <Notice type="error">{error}</Notice>}
      {message && <Notice>{message}</Notice>}
      <Field
        label="Correo de prueba"
        type="email"
        name="email"
        autoComplete="email"
        required
        disabled={busy}
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <Button type="submit" disabled={busy}>
        {busy ? "Procesando…" : "Recuperar contraseña"}
      </Button>
    </form>
  );
}
