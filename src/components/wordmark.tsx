import Link from "next/link";

export function Wordmark({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`flex items-center gap-2 font-heading text-lg font-bold tracking-tight ${className ?? ""}`}
    >
      <span
        aria-hidden
        className="grid size-7 place-items-center rounded-md bg-brand text-sm text-primary-foreground"
      >
        T
      </span>
      Tindahan
    </Link>
  );
}
