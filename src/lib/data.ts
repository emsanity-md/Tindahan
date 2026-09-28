/**
 * Domain types for the Tindahan demo.
 *
 * There is deliberately no `sku` and no `barcode`: the demo has no barcode
 * scanning, so a product's name is its only identifier. That makes search the
 * critical path at the counter — typing "sanmig" must find "San Miguel".
 *
 * `stock` is a number rather than an integer because `unit` is meaningful:
 * 2.5 kg of palay is a real quantity, and 0.5 without a unit is meaningless.
 */

export type Unit = "pc" | "pack" | "box" | "kg" | "ml";

export type Category =
  | "Beverages"
  | "Noodles & Pantry"
  | "Snacks"
  | "Canned Goods"
  | "Household"
  | "Personal Care"
  | "School Supplies";

export type Product = {
  id: string;
  name: string;
  category: Category;
  unit: Unit;
  costPrice: number;
  sellingPrice: number;
  stock: number;
  reorderLevel: number;
  active: boolean;
  /**
   * Nicknames people actually type at the counter. There is no barcode to
   * scan, so "coke" has to reach "Coca-Cola 1.5L" — and the name alone
   * cannot, because it contains no "k".
   */
  aliases?: string[];
};

export type CartLine = {
  productId: string;
  quantity: number;
};

export type SaleItem = {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type PaymentMethod = "cash" | "gcash" | "maya";

export type Sale = {
  id: string;
  receiptNo: string;
  items: SaleItem[];
  subtotal: number;
  total: number;
  paymentMethod: PaymentMethod;
  amountTendered: number;
  changeDue: number;
  createdAt: string;
};

export type StockState = "out" | "low" | "healthy";

export function stockState(p: Product): StockState {
  if (p.stock <= 0) return "out";
  if (p.stock <= p.reorderLevel) return "low";
  return "healthy";
}

export const CATEGORIES: Category[] = [
  "Beverages",
  "Noodles & Pantry",
  "Snacks",
  "Canned Goods",
  "Household",
  "Personal Care",
  "School Supplies",
];

export const UNITS: Unit[] = ["pc", "pack", "box", "kg", "ml"];

/**
 * Sample catalog with real PH prices. Stock is distributed on purpose so every
 * UI state is reachable on first load: healthy, low (below reorder level), and
 * out of stock.
 */
export const INITIAL_PRODUCTS: Product[] = [
  // Beverages
  { id: "p01", name: "San Miguel Pale Pilsen 320ml", category: "Beverages", unit: "pc", costPrice: 28, sellingPrice: 35, stock: 48, reorderLevel: 12, active: true, aliases: ["pale pilsen", "beer", "san mig"] },
  { id: "p02", name: "Coca-Cola 1.5L", category: "Beverages", unit: "pc", costPrice: 78, sellingPrice: 90, stock: 22, reorderLevel: 8, active: true, aliases: ["coke", "coca cola", "soft drink"] },
  { id: "p03", name: "Bottled Water 500ml", category: "Beverages", unit: "pc", costPrice: 10, sellingPrice: 15, stock: 96, reorderLevel: 24, active: true },
  { id: "p04", name: "Milo 300g", category: "Beverages", unit: "pc", costPrice: 52, sellingPrice: 60, stock: 14, reorderLevel: 6, active: true, aliases: ["chocolate malt", "nestle milo"] },
  { id: "p05", name: "Kopiko 3-in-1 Sachet", category: "Beverages", unit: "box", costPrice: 7, sellingPrice: 10, stock: 60, reorderLevel: 20, active: true },
  { id: "p06", name: "Gatorade 1L", category: "Beverages", unit: "pc", costPrice: 60, sellingPrice: 70, stock: 9, reorderLevel: 6, active: true },
  { id: "p07", name: "Red Bull 250ml", category: "Beverages", unit: "pc", costPrice: 105, sellingPrice: 125, stock: 11, reorderLevel: 6, active: true },

  // Noodles & Pantry
  { id: "p08", name: "Indomie Chicken 85g", category: "Noodles & Pantry", unit: "pc", costPrice: 11, sellingPrice: 15, stock: 120, reorderLevel: 36, active: true, aliases: ["noodles", "indomi"] },
  { id: "p09", name: "Lucky Me! Beef 60g", category: "Noodles & Pantry", unit: "pc", costPrice: 10, sellingPrice: 13, stock: 104, reorderLevel: 30, active: true },
  { id: "p10", name: "Pancit Canton", category: "Noodles & Pantry", unit: "pc", costPrice: 11, sellingPrice: 14, stock: 3, reorderLevel: 12, active: true },
  { id: "p11", name: "Palay (Well-Milled)", category: "Noodles & Pantry", unit: "kg", costPrice: 340, sellingPrice: 380, stock: 24.5, reorderLevel: 10, active: true, aliases: ["rice", "bigas"] },
  { id: "p12", name: "White Sugar 1kg", category: "Noodles & Pantry", unit: "kg", costPrice: 62, sellingPrice: 72, stock: 18, reorderLevel: 8, active: true },
  { id: "p13", name: "Cooking Oil 1L", category: "Noodles & Pantry", unit: "ml", costPrice: 95, sellingPrice: 110, stock: 12, reorderLevel: 6, active: true },
  { id: "p14", name: "Basmati Rice 5kg", category: "Noodles & Pantry", unit: "kg", costPrice: 320, sellingPrice: 365, stock: 7.5, reorderLevel: 4, active: true },

  // Snacks
  { id: "p15", name: "Skyflakes 250g", category: "Snacks", unit: "box", costPrice: 26, sellingPrice: 30, stock: 4, reorderLevel: 8, active: true, aliases: ["sky flakes", "crackers", "biscuit"] },
  { id: "p16", name: "Piattos Beef 60g", category: "Snacks", unit: "pc", costPrice: 22, sellingPrice: 25, stock: 38, reorderLevel: 12, active: true },
  { id: "p17", name: "Mamasapano 140g", category: "Snacks", unit: "pc", costPrice: 26, sellingPrice: 30, stock: 16, reorderLevel: 8, active: true, aliases: ["choco", "chocolate bar"] },
  { id: "p18", name: "Jack 'n Jill Nova 60g", category: "Snacks", unit: "pc", costPrice: 20, sellingPrice: 24, stock: 27, reorderLevel: 10, active: true },
  { id: "p19", name: "Chupa Chups Stick", category: "Snacks", unit: "pc", costPrice: 10, sellingPrice: 13, stock: 44, reorderLevel: 12, active: true },
  { id: "p20", name: "Oreo 133g", category: "Snacks", unit: "pc", costPrice: 30, sellingPrice: 36, stock: 13, reorderLevel: 8, active: true },

  // Canned Goods
  { id: "p21", name: "Century Tuna Flakes", category: "Canned Goods", unit: "pc", costPrice: 30, sellingPrice: 35, stock: 31, reorderLevel: 12, active: true },
  { id: "p22", name: "Century Sardines", category: "Canned Goods", unit: "pc", costPrice: 18, sellingPrice: 22, stock: 52, reorderLevel: 15, active: true },
  { id: "p23", name: "Corned Beef 150g", category: "Canned Goods", unit: "pc", costPrice: 38, sellingPrice: 45, stock: 6, reorderLevel: 8, active: true },
  { id: "p24", name: "Hotdog Salami 60g", category: "Canned Goods", unit: "pc", costPrice: 25, sellingPrice: 30, stock: 19, reorderLevel: 8, active: true },

  // Household
  { id: "p25", name: "Dishwashing Liquid 250ml", category: "Household", unit: "ml", costPrice: 32, sellingPrice: 38, stock: 15, reorderLevel: 6, active: true },
  { id: "p26", name: "Laundry Powder 1kg", category: "Household", unit: "kg", costPrice: 68, sellingPrice: 78, stock: 9, reorderLevel: 6, active: true },
  { id: "p27", name: "Downy Fabric Conditioner 250ml", category: "Household", unit: "ml", costPrice: 95, sellingPrice: 110, stock: 5, reorderLevel: 6, active: true, aliases: ["downy", "fabric conditioner", "softener"] },
  { id: "p28", name: "Toilet Paper 10 rolls", category: "Household", unit: "pack", costPrice: 88, sellingPrice: 105, stock: 8, reorderLevel: 4, active: true },
  { id: "p29", name: "Alcohol 500ml", category: "Household", unit: "ml", costPrice: 58, sellingPrice: 68, stock: 2, reorderLevel: 6, active: true },

  // Personal Care
  { id: "p30", name: "Colgate Toothpaste 150g", category: "Personal Care", unit: "pc", costPrice: 62, sellingPrice: 70, stock: 0, reorderLevel: 8, active: true, aliases: ["toothpaste", "paste"] },
  { id: "p31", name: "Sunsilk Shampoo 270ml", category: "Personal Care", unit: "ml", costPrice: 82, sellingPrice: 92, stock: 12, reorderLevel: 6, active: true, aliases: ["shampoo", "sun silk"] },
  { id: "p32", name: "Safeguard Bar Soap 90g", category: "Personal Care", unit: "pc", costPrice: 42, sellingPrice: 48, stock: 33, reorderLevel: 12, active: true },

  // School Supplies
  { id: "p33", name: "Ballpen Black", category: "School Supplies", unit: "pc", costPrice: 8, sellingPrice: 12, stock: 78, reorderLevel: 24, active: true },
  { id: "p34", name: "Notebook 80 lvs", category: "School Supplies", unit: "pc", costPrice: 28, sellingPrice: 35, stock: 21, reorderLevel: 8, active: true },
  { id: "p35", name: "Crayon 8 ct", category: "School Supplies", unit: "box", costPrice: 12, sellingPrice: 18, stock: 26, reorderLevel: 8, active: true },
  { id: "p36", name: "Bond Paper Ream A4", category: "School Supplies", unit: "box", costPrice: 185, sellingPrice: 215, stock: 3, reorderLevel: 4, active: true },
];
