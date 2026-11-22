import { useState } from "react";
import {
  Button,
  PageTitle,
  StatCard,
  Table,
  Tabs,
  Field,
  Notice,
} from "../components/UI";
import { money, date } from "../utils/format";
import { demoUsers, sampleSales } from "../data/events";
export default function Admin({
  session,
  events,
  orders,
  remaining,
  go,
  setOverrides,
}) {
  const [tab, setTab] = useState("Dashboard");
  const [editing, setEditing] = useState(null);
  const [title, setTitle] = useState("");
  if (!session || session.role === "Cliente")
    return (
      <>
        <Notice>
          Selecciona un rol de administrador u organizador de demostración para
          explorar este panel.
        </Notice>
        <Button onClick={() => go("cuenta")}>Elegir rol de prueba</Button>
      </>
    );
  const confirmed = orders.filter((o) => o.status === "Confirmada");
  const liveTotal = confirmed.reduce((s, o) => s + o.total, 0);
  return (
    <>
      <PageTitle
        eyebrow={`PANEL DE ${session.role.toUpperCase()}`}
        title="Cada experiencia, bajo control"
      >
        Información de demostración para gestionar tus eventos.
      </PageTitle>
      <Tabs
        items={["Dashboard", "Eventos", "Inventario", "Usuarios", "Reportes"]}
        value={tab}
        onChange={setTab}
      />
      {tab === "Dashboard" && (
        <>
          <div className="stats">
            <StatCard
              label="Eventos en catálogo"
              value={events.length}
              note="Catálogo simulado"
            />
            <StatCard
              label="Compras realizadas"
              value={confirmed.length}
              note="En este navegador"
            />
            <StatCard
              label="Ventas de prueba"
              value={money(liveTotal)}
              note="Sin cobros reales"
            />
          </div>
          <section className="panel">
            <h2>Próximos eventos</h2>
            <EventTable events={events} />
          </section>
        </>
      )}
      {tab === "Eventos" && (
        <section className="panel">
          <h2>Gestión de eventos</h2>
          <p>Los cambios de título se guardan únicamente en este navegador.</p>
          <Table headers={["Evento", "Estado", "Acciones"]}>
            {events.map((e) => (
              <tr key={e.id}>
                <td>{e.title}</td>
                <td>{e.status}</td>
                <td>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setEditing(e.id);
                      setTitle(e.title);
                    }}
                  >
                    Editar título
                  </Button>
                </td>
              </tr>
            ))}
          </Table>
          {editing && (
            <form
              className="form"
              onSubmit={(e) => {
                e.preventDefault();
                if (title.trim().length >= 3) {
                  setOverrides((v) => ({ ...v, [editing]: title.trim() }));
                  setEditing(null);
                }
              }}
            >
              <Field
                label="Título del evento"
                required
                minLength={3}
                maxLength={80}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <div>
                <Button>Guardar</Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setEditing(null)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          )}
        </section>
      )}
      {tab === "Inventario" && (
        <section className="panel">
          <h2>Zonas, disponibilidad y precios</h2>
          <Table headers={["Evento", "Zona", "Precio", "Disponibles"]}>
            {events.flatMap((e) =>
              e.zones.map((z) => (
                <tr key={`${e.id}-${z.id}`}>
                  <td>{e.title}</td>
                  <td>{z.name}</td>
                  <td>{money(z.price)}</td>
                  <td>
                    {remaining(e.id, z.id)} / {z.capacity}
                  </td>
                </tr>
              )),
            )}
          </Table>
        </section>
      )}
      {tab === "Usuarios" && (
        <section className="panel">
          <h2>Usuarios ficticios</h2>
          <Table headers={["Nombre", "Correo", "Rol"]}>
            {demoUsers.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
              </tr>
            ))}
          </Table>
        </section>
      )}
      {tab === "Reportes" && (
        <section className="panel">
          <h2>Ventas por evento</h2>
          <p>
            Serie estática de ejemplo; independiente de las compras realizadas
            en este navegador.
          </p>
          <div
            className="chart"
            role="img"
            aria-label="Ventas de ejemplo: Neon Nights 2940 dólares, Jazz 1560, Entre líneas 760, Indie 1876"
          >
            {sampleSales.map((s) => (
              <div key={s.event} className="chart-row">
                <span>{s.event}</span>
                <div>
                  <i style={{ width: `${s.total / 30}%` }} />
                </div>
                <strong>{money(s.total)}</strong>
              </div>
            ))}
          </div>
          <Table headers={["Evento", "Boletos", "Ingreso de ejemplo"]}>
            {sampleSales.map((s) => (
              <tr key={s.event}>
                <td>{s.event}</td>
                <td>{s.tickets}</td>
                <td>{money(s.total)}</td>
              </tr>
            ))}
          </Table>
        </section>
      )}
    </>
  );
}
function EventTable({ events }) {
  return (
    <Table headers={["Evento", "Fecha", "Estado"]}>
      {events.slice(0, 4).map((e) => (
        <tr key={e.id}>
          <td>{e.title}</td>
          <td>{date(e.date)}</td>
          <td>{e.status}</td>
        </tr>
      ))}
    </Table>
  );
}
