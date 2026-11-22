import { useEffect, useState, useRef } from "react";
import { events as originalEvents } from "./data/events";
import { usePersistent } from "./hooks/usePersistent";
import { Header, Footer } from "./components/Layout";
import { Notice, EmptyState, Button } from "./components/UI";
import Catalog from "./pages/Catalog";
import Detail from "./pages/Detail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Account from "./pages/Account";
import Tickets from "./pages/Tickets";
import Admin from "./pages/Admin";
const initialView = () => {
  try {
    return decodeURIComponent(location.hash.slice(1)) || "eventos";
  } catch {
    return "eventos";
  }
};
const isObject = (v) => v && typeof v === "object" && !Array.isArray(v);
export default function App() {
  const [view, setView] = useState(initialView);
  const [cart, setCart, cartFail] = usePersistent(
    "gt-cart",
    [],
    (v) =>
      Array.isArray(v) &&
      v.every(
        (i) =>
          isObject(i) &&
          Number.isInteger(i.quantity) &&
          i.quantity > 0 &&
          i.quantity <= 10,
      ),
  );
  const [orders, setOrders, ordersFail] = usePersistent(
    "gt-orders",
    [],
    (v) =>
      Array.isArray(v) && v.every((o) => isObject(o) && Array.isArray(o.items)),
  );
  const [session, setSession, sessionFail] = usePersistent(
    "gt-session",
    null,
    (v) =>
      isObject(v) && typeof v.id === "string" && typeof v.name === "string",
  );
  const [theme, setTheme] = usePersistent("gt-theme", "light", (v) =>
    ["light", "dark"].includes(v),
  );
  const [category, setCategory] = usePersistent(
    "gt-category",
    "Todos",
    (v) => typeof v === "string",
  );
  const [overrides, setOverrides] = usePersistent(
    "gt-event-titles",
    {},
    isObject,
  );
  const purchaseLock = useRef(false);
  const events = originalEvents.map((e) => ({
    ...e,
    title: overrides[e.id] || e.title,
  }));
  useEffect(() => {
    function change() {
      setView(initialView());
      window.scrollTo(0, 0);
    }
    window.addEventListener("hashchange", change);
    return () => window.removeEventListener("hashchange", change);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);
  useEffect(() => {
    document.getElementById("main")?.focus({ preventScroll: true });
  }, [view]);
  function go(next) {
    setView(next);
    location.hash = encodeURIComponent(next);
    window.scrollTo(0, 0);
  }
  function remaining(eventId, zoneId) {
    const zone = events
      .find((e) => e.id === eventId)
      ?.zones.find((z) => z.id === zoneId);
    if (!zone) return 0;
    const used = orders
      .filter((o) => o.status === "Confirmada")
      .flatMap((o) => o.items)
      .filter((i) => i.eventId === eventId && i.zoneId === zoneId)
      .reduce((s, i) => s + i.quantity, 0);
    return Math.max(0, zone.capacity - used);
  }
  const items = cart.flatMap((i) => {
    const event = events.find((e) => e.id === i.eventId);
    const zone = event?.zones.find((z) => z.id === i.zoneId);
    return event && zone ? [{ ...i, event, zone }] : [];
  });
  const total = items.reduce((s, i) => s + i.quantity * i.zone.price, 0);
  function add(eventId, zoneId, quantity) {
    const key = `${eventId}-${zoneId}`;
    const existing = cart.find((i) => i.key === key)?.quantity || 0;
    if (quantity + existing > Math.min(10, remaining(eventId, zoneId)))
      return "No hay disponibilidad para esa cantidad. Máximo 10 boletos por zona.";
    setCart((c) =>
      existing
        ? c.map((i) =>
            i.key === key ? { ...i, quantity: i.quantity + quantity } : i,
          )
        : [...c, { key, eventId, zoneId, quantity }],
    );
    return "";
  }
  function complete(data) {
    if (purchaseLock.current) return "Esta compra ya fue procesada.";
    if (!items.length) return "El carrito está vacío.";
    for (const i of items)
      if (i.quantity > remaining(i.eventId, i.zoneId))
        return "La disponibilidad cambió. Revisa tu carrito.";
    purchaseLock.current = true;
    const order = {
      id: `GT-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      userId: session?.id || data.email.toLowerCase(),
      name: data.name,
      status: "Confirmada",
      items: items.map(({ key, eventId, zoneId, quantity }) => ({
        key,
        eventId,
        zoneId,
        quantity,
      })),
      total,
    };
    setOrders((o) => [order, ...o]);
    if (!session)
      setSession({
        id: data.email.toLowerCase(),
        name: data.name,
        email: data.email,
        role: "Cliente",
      });
    setCart([]);
    return "";
  }
  useEffect(() => {
    if (view !== "pago") purchaseLock.current = false;
  }, [view]);
  function resetDemo() {
    if (
      !window.confirm(
        "¿Reiniciar esta demostración? Se borrarán el carrito, las compras, la sesión y las preferencias de prueba de este navegador.",
      )
    )
      return;
    setCart([]);
    setOrders([]);
    setSession(null);
    setTheme("light");
    setCategory("Todos");
    setOverrides({});
    go("eventos");
  }
  const myOrders = orders.filter((o) => o.userId === session?.id);
  let content;
  if (view === "eventos")
    content = (
      <Catalog
        onReset={resetDemo}
        events={events}
        onOpen={(id) => go(`evento/${id}`)}
        category={category}
        setCategory={setCategory}
      />
    );
  else if (view.startsWith("evento/")) {
    const event = events.find((e) => e.id === view.split("/")[1]);
    content = event ? (
      <Detail
        key={event.id}
        event={event}
        remaining={remaining}
        onAdd={add}
        go={go}
      />
    ) : (
      <EmptyState
        title="Evento no encontrado"
        action={<Button onClick={() => go("eventos")}>Explorar eventos</Button>}
      />
    );
  } else if (view === "carrito")
    content = (
      <Cart
        items={items}
        total={total}
        remaining={remaining}
        onQuantity={(key, q) =>
          setCart((c) =>
            c.map((i) => (i.key === key ? { ...i, quantity: q } : i)),
          )
        }
        onRemove={(key) => setCart((c) => c.filter((i) => i.key !== key))}
        go={go}
      />
    );
  else if (view === "pago")
    content = (
      <Checkout
        items={items}
        total={total}
        session={session}
        onComplete={complete}
        go={go}
      />
    );
  else if (view === "cuenta")
    content = <Account session={session} setSession={setSession} go={go} />;
  else if (view === "boletos")
    content = (
      <Tickets
        orders={myOrders}
        events={events}
        onCancel={(id) =>
          setOrders((os) =>
            os.map((o) => (o.id === id ? { ...o, status: "Cancelada" } : o)),
          )
        }
        go={go}
      />
    );
  else if (view === "admin")
    content = (
      <Admin
        session={session}
        events={events}
        orders={orders}
        remaining={remaining}
        go={go}
        overrides={overrides}
        setOverrides={setOverrides}
      />
    );
  else
    content = (
      <EmptyState
        title="Página no encontrada"
        action={<Button onClick={() => go("eventos")}>Volver al inicio</Button>}
      />
    );
  return (
    <>
      <a
        className="skip"
        href="#main"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById("main")?.focus();
        }}
      >
        Saltar al contenido
      </a>
      <Header
        view={view}
        go={go}
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)}
        session={session}
        theme={theme}
        setTheme={setTheme}
      />
      {(cartFail || ordersFail || sessionFail) && (
        <Notice type="error">
          El navegador no permite guardar los datos. Los cambios durarán solo
          esta sesión.
        </Notice>
      )}
      <main
        id="main"
        tabIndex={-1}
        className={view === "eventos" ? "main-home" : "main-inner"}
      >
        {content}
      </main>
      <Footer />
    </>
  );
}
