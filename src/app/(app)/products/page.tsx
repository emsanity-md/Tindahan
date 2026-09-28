"use client";

import { useState } from "react";
import { Plus, Pencil, Search } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStore } from "@/lib/store";
import { CATEGORIES, UNITS, type Category, type Product, type Unit } from "@/lib/data";
import { peso, qty } from "@/lib/format";

type Draft = {
  id: string;
  name: string;
  category: Category;
  unit: Unit;
  costPrice: string;
  sellingPrice: string;
  stock: string;
  reorderLevel: string;
};

const EMPTY: Draft = {
  id: "",
  name: "",
  category: "Beverages",
  unit: "pc",
  costPrice: "",
  sellingPrice: "",
  stock: "0",
  reorderLevel: "5",
};

function toDraft(p: Product): Draft {
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    unit: p.unit,
    costPrice: String(p.costPrice),
    sellingPrice: String(p.sellingPrice),
    stock: String(p.stock),
    reorderLevel: String(p.reorderLevel),
  };
}

export default function ProductsPage() {
  const { products, dispatch } = useStore();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>(EMPTY);

  const filtered = products.filter((p) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  });

  const set = (patch: Partial<Draft>) => setDraft((d) => ({ ...d, ...patch }));

  const openNew = () => {
    setDraft({ ...EMPTY, id: `p-${Date.now()}` });
    setOpen(true);
  };

  const openEdit = (p: Product) => {
    setDraft(toDraft(p));
    setOpen(true);
  };

  const save = () => {
    if (!draft.name.trim()) {
      toast.error("Give the product a name.");
      return;
    }
    const selling = Number(draft.sellingPrice);
    if (Number.isNaN(selling) || selling < 0) {
      toast.error("Enter a valid selling price.");
      return;
    }

    dispatch({
      type: "upsertProduct",
      product: {
        id: draft.id || `p-${Date.now()}`,
        name: draft.name.trim(),
        category: draft.category,
        unit: draft.unit,
        costPrice: Number(draft.costPrice) || 0,
        sellingPrice: selling,
        stock: Number(draft.stock) || 0,
        reorderLevel: Number(draft.reorderLevel) || 0,
        active: true,
      },
    });
    setOpen(false);
    toast.success("Product saved.", {
      description: `${draft.name.trim()} · ${peso(selling)}`,
    });
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-gutter py-8 md:px-gutter-md md:py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl">Products</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Name, price, and category are all a product needs here.
          </p>
        </div>
        <Button onClick={openNew}>
          <Plus className="size-4" />
          Add product
        </Button>
      </div>

      <div className="relative mt-6">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products"
          className="h-11 pl-9"
        />
      </div>

      <Card className="mt-5 overflow-hidden">
        <div className="divide-y">
          {filtered.length === 0 && (
            <p className="px-4 py-12 text-center text-sm text-muted-foreground">
              No products match your search.
            </p>
          )}
          {filtered.map((p) => (
            <div key={p.id} className="flex items-center gap-3 p-4">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{p.name}</p>
                <p className="nums mt-0.5 text-xs text-muted-foreground">
                  {p.category} · {qty(p.stock)} {p.unit} in stock
                </p>
              </div>
              <Badge
                variant="outline"
                className="nums shrink-0 text-muted-foreground"
              >
                {peso(p.sellingPrice)}
              </Badge>
              <Button
                size="icon"
                variant="ghost"
                className="size-8 shrink-0"
                onClick={() => openEdit(p)}
                aria-label={`Edit ${p.name}`}
              >
                <Pencil className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading">
              {draft.id && products.some((p) => p.id === draft.id)
                ? "Edit product"
                : "Add product"}
            </DialogTitle>
            <DialogDescription>
              There are no barcode or SKU fields — products are found by name.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <Input
                id="name"
                value={draft.name}
                onChange={(e) => set({ name: e.target.value })}
                placeholder="e.g. Skyflakes 250g"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Category</label>
                <Select
                  value={draft.category}
                  onValueChange={(v) => set({ category: v as Category })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Unit</label>
                <Select
                  value={draft.unit}
                  onValueChange={(v) => set({ unit: v as Unit })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {UNITS.map((u) => (
                      <SelectItem key={u} value={u}>
                        {u}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor="cost" className="text-sm font-medium">
                  Cost price
                </label>
                <Input
                  id="cost"
                  value={draft.costPrice}
                  onChange={(e) => set({ costPrice: e.target.value.replace(/[^\d.]/g, "") })}
                  inputMode="decimal"
                  placeholder="0"
                  className="nums"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="sell" className="text-sm font-medium">
                  Selling price
                </label>
                <Input
                  id="sell"
                  value={draft.sellingPrice}
                  onChange={(e) => set({ sellingPrice: e.target.value.replace(/[^\d.]/g, "") })}
                  inputMode="decimal"
                  placeholder="0"
                  className="nums"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="stock" className="text-sm font-medium">
                  Stock on hand
                </label>
                <Input
                  id="stock"
                  value={draft.stock}
                  onChange={(e) => set({ stock: e.target.value.replace(/[^\d.]/g, "") })}
                  inputMode="decimal"
                  className="nums"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="reorder" className="text-sm font-medium">
                  Reorder level
                </label>
                <Input
                  id="reorder"
                  value={draft.reorderLevel}
                  onChange={(e) => set({ reorderLevel: e.target.value.replace(/[^\d.]/g, "") })}
                  inputMode="decimal"
                  className="nums"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={save}>Save product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
