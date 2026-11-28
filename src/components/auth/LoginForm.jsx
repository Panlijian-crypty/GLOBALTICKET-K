import { useState } from "react";
import { Button, Field, Notice } from "../UI";
import { demoUsers } from "../../data/events";
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
      if (password !== "Global2026!") {
        setError("Usa un correo registrado y la contraseña de demostración Global2026!.");
        return;
      }
      let user = demoUsers.find((candidate) => candidate.email === normalizedEmail);
      if (!user) {
        try {
          const saved = JSON.parse(localStorage.getItem(`gt-registro:${normalizedEmail}`));
          if (saved?.email === normalizedEmail && typeof saved.name === "string" && saved.name.trim()) {
            user = { id: normalizedEmail, email: normalizedEmail, name: saved.name, role: "Cliente" };
          }
        } catch {
          setError("No se pudo leer el registro guardado en este navegador.");
          return;
        }
      }
      if (!user) {
        setError("Usa un correo registrado y la contraseña de demostración Global2026!.");
        return;
      }
      setPassword("");
      onSuccess(user);
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
        Para practicar, usa cliente@example.com, organizador@example.com,
        admin@example.com o un correo registrado en este navegador. La contraseña
        de demostración es Global2026!.
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
