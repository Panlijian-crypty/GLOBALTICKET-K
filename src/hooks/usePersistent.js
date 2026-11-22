import { useEffect, useRef, useState } from "react";

export function usePersistent(key, initial, validate = () => true) {
  const [state, setState] = useState(() => {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return {
        value: value !== null && validate(value) ? value : initial,
        failed: false,
      };
    } catch {
      return { value: initial, failed: false };
    }
  });
  const latest = useRef(state.value);

  // La escritura ocurre al actualizar el dato, sin efectos con renders en cascada.
  function update(nextValue) {
    const value =
      typeof nextValue === "function" ? nextValue(latest.current) : nextValue;
    let failed = false;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      failed = true;
    }
    latest.current = value;
    setState({ value, failed });
  }

  useEffect(() => {
    function synchronize(event) {
      if (
        event.storageArea !== localStorage ||
        (event.key !== key && event.key !== null)
      )
        return;
      try {
        const parsed = event.key === null ? null : JSON.parse(event.newValue);
        const value = parsed !== null && validate(parsed) ? parsed : initial;
        latest.current = value;
        setState({ value, failed: false });
      } catch {
        latest.current = initial;
        setState({ value: initial, failed: false });
      }
    }
    window.addEventListener("storage", synchronize);
    return () => window.removeEventListener("storage", synchronize);
  }, [key, initial, validate]);

  return [state.value, update, state.failed];
}
