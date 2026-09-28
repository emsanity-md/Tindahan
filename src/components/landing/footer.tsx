import Link from "next/link";
import { Wordmark } from "@/components/wordmark";
import { Container } from "@/components/layout/container";

export function LandingFooter() {
  return (
    <footer className="border-t bg-background">
      <Container>
        <div className="flex flex-col gap-6 py-10 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <Wordmark />
            <p className="mt-3 text-sm text-muted-foreground">
              An inventory and point-of-sale system for small stores. Helps store
              owners manage products, monitor inventory, process sales, and
              track transactions without manual record-keeping.
            </p>
          </div>

          <nav className="flex flex-col gap-2 text-sm">
            <p className="font-heading font-bold">Demo</p>
            <Link href="/pos" className="text-muted-foreground hover:text-foreground">
              Point of sale
            </Link>
            <Link href="/inventory" className="text-muted-foreground hover:text-foreground">
              Inventory
            </Link>
            <Link href="/sales" className="text-muted-foreground hover:text-foreground">
              Sales
            </Link>
          </nav>
        </div>

        <div className="flex flex-col gap-2 border-t py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Tindahan. Demo build — no server, no
            real store, and no data is collected about you.
          </p>
        </div>
      </Container>
    </footer>
  );
}
