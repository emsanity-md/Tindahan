"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";

/**
 * Warns before a reload or close while there's unsaved work.
 *
 * What this cannot do, so it isn't oversold in the UI: the dialog text is
 * controlled by the browser (no custom wording), it does not fire on in-app
 * navigation, and iOS Safari only prompts after the user has interacted with
 * the page. It is a desktop refresh guard — the Reset demo data button in the
 * header is the reliable recovery path.
 */
export function ReloadGuard() {
  const { cart, dirty } = useStore();

  useEffect(() => {
    const hasWork = cart.length > 0 || dirty;
    if (!hasWork) return;

    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [cart.length, dirty]);

  return null;
}
