import { Plus, Pencil, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { peso, qty } from "@/lib/format";

/**
 * The products half of the hero window. Mirrors the real /products screen —
 * search, the product list, and the add/edit fields — including the note that
 * there is no barcode or SKU, because that absence is a real design decision
 * in the app rather than something to hide.
 *
 * Static and non-interactive: the inputs are readOnly and the buttons are
 * removed from the tab order, so the window's tab strip keeps keyboard focus.
 */
const PRODUCTS = [
  { name: "San Miguel Pale Pilsen 320ml", category: "Beverages", stock: 48, unit: "pc", price: 35 },
  { name: "Coca-Cola 1.5L", category: "Beverages", stock: 22, unit: "pc", price: 90 },
  { name: "Indomie Chicken 85g", category: "Noodles & Pantry", stock: 120, unit: "pc", price: 15 },
  { name: "Skyflakes 250g", category: "Snacks", stock: 4, unit: "box", price: 30 },
  { name: "Bottled Water 500ml", category: "Beverages", stock: 96, unit: "pc", price: 15 },
  { name: "Kopiko 3-in-1 Coffee", category: "Noodles & Pantry", stock: 0, unit: "pc", price: 8 },
];

const FIELDS = [
  { label: "Name", value: "", placeholder: "e.g. Skyflakes 250g", wide: true },
  { label: "Cost price", value: "25", placeholder: "0" },
  { label: "Selling price", value: "30", placeholder: "0" },
  { label: "Stock on hand", value: "4", placeholder: "0" },
  { label: "Reorder level", value: "6", placeholder: "0" },
];

export function ProductsMock() {
  return (
    <Card className="w-full overflow-hidden shadow-sm">
      <div className="border-b bg-paper px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-heading text-base font-bold">Products</p>
            <p className="text-xs text-muted-foreground">
              Name, price, and category are all a product needs here.
            </p>
          </div>
          <Button
            size="sm"
            tabIndex={-1}
            className="pointer-events-none shrink-0"
          >
            <Plus className="size-4" />
            Add product
          </Button>
        </div>
        <div className="relative mt-4">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            readOnly
            tabIndex={-1}
            placeholder="Search products"
            className="pointer-events-none bg-card pl-9"
          />
        </div>
      </div>

      <div className="grid gap-x-6 md:grid-cols-2">
        <div className="divide-y">
          {PRODUCTS.slice(0, 3).map((p) => (
            <div key={p.name} className="flex items-center gap-3 py-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{p.name}</p>
                <p className="nums mt-0.5 truncate text-xs text-muted-foreground">
                  {p.category} · {qty(p.stock)} {p.unit} in stock
                </p>
              </div>
              <Badge variant="outline" className="nums shrink-0 text-muted-foreground">
                {peso(p.price)}
              </Badge>
              <span className="grid size-8 shrink-0 place-items-center rounded-md text-muted-foreground">
                <Pencil className="size-4" />
              </span>
            </div>
          ))}
        </div>
        <div className="divide-y">
          {PRODUCTS.slice(3).map((p) => (
            <div key={p.name} className="flex items-center gap-3 py-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{p.name}</p>
                <p className="nums mt-0.5 truncate text-xs text-muted-foreground">
                  {p.category} · {qty(p.stock)} {p.unit} in stock
                </p>
              </div>
              <Badge variant="outline" className="nums shrink-0 text-muted-foreground">
                {peso(p.price)}
              </Badge>
              <span className="grid size-8 shrink-0 place-items-center rounded-md text-muted-foreground">
                <Pencil className="size-4" />
              </span>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div className="bg-paper px-5 py-4">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-sm font-medium">Add product</p>
          <p className="text-xs text-muted-foreground">No barcode or SKU — found by name</p>
        </div>

        <div className="mt-3.5 grid gap-3.5 sm:grid-cols-2">
          {FIELDS.map((f) => (
            <div key={f.label} className={f.wide ? "space-y-1.5 sm:col-span-2" : "space-y-1.5"}>
              <p className="text-xs font-medium">{f.label}</p>
              <Input
                readOnly
                tabIndex={-1}
                value={f.value}
                placeholder={f.placeholder}
                className="pointer-events-none nums bg-card"
              />
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
