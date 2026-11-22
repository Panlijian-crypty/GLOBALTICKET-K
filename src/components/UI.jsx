import { Children, cloneElement, isValidElement, useEffect, useState } from "react";
import QRCode from "qrcode";
export function Button({ children, variant = "", className = "", ...props }) {
  return (
    <button className={`button ${variant} ${className}`} {...props}>
      {children}
    </button>
  );
}
export function Badge({ children }) {
  return <span className="badge">{children}</span>;
}
export function Field({ label, error, children, ...props }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children || <input aria-invalid={!!error} {...props} />}{" "}
      {error && <small className="error">{error}</small>}
    </label>
  );
}
export function EmptyState({ title, children, action }) {
  return (
    <div className="empty">
      <span className="empty-icon" aria-hidden="true">
        ◇
      </span>
      <h2>{title}</h2>
      <p>{children}</p>
      {action}
    </div>
  );
}
export function Notice({ children, type = "info" }) {
  return (
    <div
      className={`notice ${type}`}
      role={type === "error" ? "alert" : "status"}
    >
      {children}
    </div>
  );
}
export function PageTitle({ eyebrow, title, children }) {
  return (
    <div className="page-title">
      <span className="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      {children && <p>{children}</p>}
    </div>
  );
}
export function Stepper({ step }) {
  return (
    <ol className="stepper" aria-label="Progreso de compra">
      {["Carrito", "Tus datos", "Pago", "Confirmación"].map((s, i) => (
        <li
          key={s}
          aria-current={i === step ? "step" : undefined}
          className={i <= step ? "active" : ""}
        >
          <span>{i + 1}</span>
          {s}
        </li>
      ))}
    </ol>
  );
}
export function QuantityPicker({ value, onChange, max = 10 }) {
  return (
    <div className="quantity">
      <Button
        variant="ghost"
        aria-label="Disminuir cantidad"
        disabled={value <= 1}
        onClick={() => onChange(value - 1)}
      >
        −
      </Button>
      <output aria-label="Cantidad de boletos">{value}</output>
      <Button
        variant="ghost"
        aria-label="Aumentar cantidad"
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
      >
        +
      </Button>
    </div>
  );
}
export function QR({ value }) {
  const [src, setSrc] = useState("");
  useEffect(() => {
    let active = true;
    QRCode.toDataURL(value, { margin: 2, width: 180 }).then((s) => {
      if (active) setSrc(s);
    });
    return () => {
      active = false;
    };
  }, [value]);
  return src ? (
    <img className="qr" src={src} alt="Código QR de boleto de demostración" />
  ) : (
    <span role="status">Generando QR…</span>
  );
}
export function StatCard({ label, value, note }) {
  return (
    <article className="stat">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{note}</small>
    </article>
  );
}
export function Table({ headers, children }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {headers.map((h) => (
              <th key={h} scope="col">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{Children.map(children, (row) =>
          isValidElement(row)
            ? cloneElement(row, {}, Children.map(row.props.children, (cell, index) =>
                isValidElement(cell) ? cloneElement(cell, { "data-label": headers[index] }) : cell
              ))
            : row
        )}</tbody>
      </table>
    </div>
  );
}
export function Tabs({ items, value, onChange }) {
  return (
    <div className="tabs" aria-label="Secciones">
      {items.map((item) => (
        <Button
          key={item}
          variant={value === item ? "" : "ghost"}
          aria-pressed={value === item}
          onClick={() => onChange(item)}
        >
          {item}
        </Button>
      ))}
    </div>
  );
}
