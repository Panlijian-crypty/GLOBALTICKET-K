export const money = (n) =>
  new Intl.NumberFormat("es-SV", { style: "currency", currency: "USD" }).format(
    n,
  );
export const date = (s) =>
  new Intl.DateTimeFormat("es-SV", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(s));
export const delay = (ms, signal) =>
  new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Operación cancelada", "AbortError"));
      return;
    }
    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", abort);
      resolve();
    }, ms);
    function abort() {
      clearTimeout(timer);
      reject(new DOMException("Operación cancelada", "AbortError"));
    }
    signal?.addEventListener("abort", abort, { once: true });
  });
export const emailValid = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
