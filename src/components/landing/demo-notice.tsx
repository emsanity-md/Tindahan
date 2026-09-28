"use client";

import { useCallback, useSyncExternalStore } from "react";
import { X, FlaskConical } from "lucide-react";

const KEY = "tindahan:demo-notice-dismissed";

const listeners = new Set<() => void>();
let dismissed = false;
let hydrated = false;

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  if (!hydrated) {
    hydrated = true;
    dismissed = sessionStorage.getItem(KEY) === "1";
    emit();
  }
  return () => {
    listeners.delete(onChange);
  };
}

/**
 * Honest framing: this is a demo build with no backend. Dismissible, but the
 * footer keeps a permanent version so dismissing never erases the message.
 *
 * The server snapshot is always `dismissed = false`, so SSR and the first
 * client render agree and the strip doesn't flash in and out on hydration.
 */
export function DemoNotice() {
  const isDismissed = useSyncExternalStore(
    subscribe,
    () => dismissed,
    () => false,
  );

  const dismiss = useCallback(() => {
    sessionStorage.setItem(KEY, "1");
    dismissed = true;
    emit();
  }, []);

  if (isDismissed) return null;

  return (
    <div className="border-b bg-brand-tint">
      <div className="mx-auto flex w-full max-w-6xl items-start gap-2.5 px-gutter py-2.5 md:px-gutter-md">
        <FlaskConical className="mt-0.5 size-4 shrink-0 text-brand-strong" />
        <p className="flex-1 text-sm text-accent-foreground">
          <span className="font-semibold">Demo build of Tindahan.</span> No
          server, no real store, and no data is collected about you.
        </p>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss demo notice"
          className="-mr-1 shrink-0 rounded-sm p-1 text-accent-foreground/70 transition-colors hover:bg-brand/10 hover:text-accent-foreground"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}
