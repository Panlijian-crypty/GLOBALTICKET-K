import { useEffect, useRef, useState } from "react";
import { delay } from "../utils/format";

// Bloquea envíos repetidos y descarta la respuesta si se abandona el formulario.
export function useDelayedAction(milliseconds = 600) {
  const [busy, setBusy] = useState(false);
  const pending = useRef(false);
  const controller = useRef(null);

  useEffect(() => () => controller.current?.abort(), []);

  async function run(action) {
    if (pending.current) return;
    pending.current = true;
    const request = new AbortController();
    controller.current = request;
    setBusy(true);
    try {
      await delay(milliseconds, request.signal);
      if (!request.signal.aborted) action();
    } catch (error) {
      if (error.name !== "AbortError") throw error;
    } finally {
      if (!request.signal.aborted) {
        pending.current = false;
        setBusy(false);
      }
    }
  }

  return { busy, run };
}
