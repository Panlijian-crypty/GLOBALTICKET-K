import { useState } from "react";
import { demoUsers } from "../data/events";
import { Button, PageTitle, Notice, Tabs } from "../components/UI";
import RegistrationForm from "../components/auth/RegistrationForm";
import RecoveryForm from "../components/auth/RecoveryForm";

const loginModules = import.meta.glob("../components/auth/LoginForm.jsx", {
  eager: true,
  import: "default",
});
const LoginForm = loginModules["../components/auth/LoginForm.jsx"];

export default function Account({ session, setSession, go }) {
  const [mode, setMode] = useState(LoginForm ? "Iniciar sesión" : "Crear cuenta");
  const [message, setMessage] = useState("");
  function startSession({ email, name, id = email, role = "Cliente" }) {
    setSession({ id, email, name, role });
    setMessage("Sesión simulada iniciada.");
  }
  return (
    <>
      <PageTitle
        eyebrow="TU ESPACIO"
        title={session ? "Mi perfil" : "Bienvenido a GLOBALTICKET"}
      >
        Tus experiencias, en un solo lugar.
      </PageTitle>
      {session ? (
        <div className="panel account-panel">
          <h2>{session.name}</h2>
          <p>{session.email}</p>
          <p>
            Rol de demostración: <strong>{session.role}</strong>
          </p>
          <Button onClick={() => go("boletos")}>Mis boletos</Button>
          <Button
            variant="ghost"
            onClick={() => {
              setSession(null);
              setMessage("Sesión cerrada.");
            }}
          >
            Cerrar sesión
          </Button>
        </div>
      ) : (
        <div className="account-layout">
          <div className="panel">
            {!LoginForm && <Notice>El inicio de sesión está pendiente de la integración de Ariana. Puedes probar Crear cuenta y los accesos de demostración.</Notice>}
            <Tabs
              items={LoginForm ? ["Iniciar sesión", "Crear cuenta", "Recuperar contraseña"] : ["Crear cuenta", "Recuperar contraseña"]}
              value={mode}
              onChange={(next) => {
                setMode(next);
                setMessage("");
              }}
            />
            {LoginForm && mode === "Iniciar sesión" && (
              <LoginForm onSuccess={startSession} />
            )}
            {mode === "Crear cuenta" && (
              <RegistrationForm onSuccess={startSession} />
            )}
            {mode === "Recuperar contraseña" && <RecoveryForm />}
          </div>
          <aside className="panel">
            <h2>Explora los roles</h2>
            <p>Accesos rápidos para probar las vistas del proyecto.</p>
            {demoUsers.map((user) => (
              <Button
                key={user.id}
                className="demo-role"
                variant="outline"
                onClick={() => {
                  setSession(user);
                  go(user.role === "Cliente" ? "eventos" : "admin");
                }}
              >
                Entrar como {user.role}
              </Button>
            ))}
          </aside>
        </div>
      )}
      {message && <Notice>{message}</Notice>}
    </>
  );
}
