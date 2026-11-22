import { useState } from "react";
import { Button, Field, Notice } from "../UI";
import { emailValid } from "../../utils/format";
import { useDelayedAction } from "../../hooks/useDelayedAction";

export default function RegistrationForm({ onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const { busy, run } = useDelayedAction();
  const field = (key) => ({
    value: form[key],
    disabled: busy,
    onChange: (event) =>
      setForm((current) => ({ ...current, [key]: event.target.value })),
  });

  function submit(event) {
    event.preventDefault();
    if (busy) return;
    setError("");
    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    if (name.length < 2)
      return setError(
        "Ingresa un nombre de al menos dos caracteres; no puede contener solo espacios.",
      );
    if (!emailValid(email)) return setError("Ingresa un correo válido.");
    if (form.password.length < 8)
      return setError(
        "La contraseña de prueba debe tener al menos 8 caracteres.",
      );
    if (form.password !== form.confirm)
      return setError("Las contraseñas deben coincidir.");
    run(() => {
      setForm((current) => ({ ...current, password: "", confirm: "" }));
      onSuccess({ name, email });
    });
  }

  return (
    <form
      className="form"
      aria-label="Crear cuenta"
      aria-busy={busy}
      noValidate
      onSubmit={submit}
    >
      <Notice>
        Registro de demostración. Usa datos ficticios. Se crea una sesión local,
        sin almacenar la contraseña ni crear una cuenta en un servidor.
      </Notice>
      {error && <Notice type="error">{error}</Notice>}
      <Field
        label="Nombre de prueba"
        name="name"
        required
        minLength={2}
        autoComplete="name"
        {...field("name")}
      />
      <Field
        label="Correo de prueba"
        name="email"
        type="email"
        required
        autoComplete="email"
        {...field("email")}
      />
      <Field
        label="Contraseña de prueba"
        name="password"
        type="password"
        required
        minLength={8}
        autoComplete="new-password"
        {...field("password")}
      />
      <Field
        label="Confirmar contraseña de prueba"
        name="confirm"
        type="password"
        required
        autoComplete="new-password"
        {...field("confirm")}
      />
      <Button type="submit" disabled={busy}>
        {busy ? "Procesando…" : "Crear cuenta"}
      </Button>
    </form>
  );
}
