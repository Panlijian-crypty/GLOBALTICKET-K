import { useState } from "react";
import { Button, Field, Notice } from "../UI";
import { emailValid } from "../../utils/format";
import { useDelayedAction } from "../../hooks/useDelayedAction";

export default function LoginForm({
  initialEmail = "cliente@example.com",
  onSuccess,
}) {
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { busy, run } = useDelayedAction();

  function submit(event) {
    event.preventDefault();
    if (busy) return;
    setError("");
    const normalizedEmail = email.trim().toLowerCase();
    if (!emailValid(normalizedEmail))
      return setError("Ingresa un correo válido.");
    if (password.length < 8)
      return setError(
        "La contraseña de prueba debe tener al menos 8 caracteres.",
      );
    run(() => {
      setPassword("");
      onSuccess({ email: normalizedEmail, name: "Cliente Demo" });
    });
  }

  return (
    <form
      className="form"
      aria-label="Iniciar sesión"
      aria-busy={busy}
      noValidate
      onSubmit={submit}
    >
      <Notice>
        Acceso simulado: usa un correo y una contraseña ficticios. No se
        comprueban contra un servidor y la contraseña no se guarda.
      </Notice>
      {error && <Notice type="error">{error}</Notice>}
      <Field
        label="Correo de prueba"
        name="email"
        type="email"
        autoComplete="username"
        required
        disabled={busy}
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <Field
        label="Contraseña de prueba"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        minLength={8}
        disabled={busy}
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <Button type="submit" disabled={busy}>
        {busy ? "Procesando…" : "Iniciar sesión"}
      </Button>
    </form>
  );
}
