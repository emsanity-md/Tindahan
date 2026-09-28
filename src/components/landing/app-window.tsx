"use client";

import { Boxes, PackagePlus, ReceiptText, ScanBarcode } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { InventoryMock } from "./inventory-mock";
import { PosMock } from "./pos-mock";
import { ProductsMock } from "./products-mock";
import { SalesMock } from "./sales-mock";

/**
 * The hero screenshot, made explorable: a window whose header mirrors
 * `AppShell` — same wordmark, same four nav items, same order — where the nav
 * items actually switch the screen below.
 *
 * The tabs are the only interactive thing in the hero, so they use the real
 * `Tabs` primitive: that gets roving tabindex, arrow-key navigation, and the
 * correct tab/tabpanel roles for free. Everything inside a panel is inert —
 * inputs are `readOnly` and every button is `tabIndex={-1}` — so tabbing
 * through the page moves past the window instead of getting stuck in a fake
 * form, and a screen reader isn't offered controls that do nothing.
 *
 * Panel switching is a CSS transition only, which means the global
 * prefers-reduced-motion rule in globals.css already suppresses it.
 */
const TABS = [
  { value: "pos", label: "POS", icon: ScanBarcode },
  { value: "inventory", label: "Inventory", icon: Boxes },
  { value: "sales", label: "Sales", icon: ReceiptText },
  { value: "products", label: "Products", icon: PackagePlus },
];

export function AppWindow() {
  return (
    <div className="overflow-hidden rounded-t-2xl border border-b-0 bg-paper shadow-sm">
      <Tabs defaultValue="pos" className="flex flex-col">
        <div className="flex items-center gap-3 border-b bg-card px-4 py-3">
          <span
            aria-hidden
            className="grid size-7 shrink-0 place-items-center rounded-md bg-brand text-sm text-primary-foreground"
          >
            T
          </span>
          <span className="font-heading text-base font-bold">Tindahan</span>
          <span aria-hidden className="h-5 w-px bg-border" />

          <TabsList className="h-auto w-auto min-w-0 justify-start gap-1 overflow-x-auto bg-transparent p-0">
            {TABS.map((t) => (
              <TabsTrigger
                key={t.value}
                value={t.value}
                className="h-auto flex-none gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground data-active:bg-brand-tint data-active:text-accent-foreground"
              >
                <t.icon className="size-4" />
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <span className="ml-auto hidden shrink-0 text-xs text-muted-foreground md:block">
            Sari-sari Store
          </span>
        </div>

        {/* min-h keeps the window from resizing as tabs change, so switching
            doesn't shove the Features section down the page. */}
        <div className="min-h-[34rem] p-4 md:p-5">
          <TabsContent value="pos" className="mx-auto max-w-md">
            <PosMock />
          </TabsContent>
          <TabsContent value="inventory">
            <InventoryMock />
          </TabsContent>
          <TabsContent value="sales">
            <SalesMock />
          </TabsContent>
          <TabsContent value="products">
            <ProductsMock />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
