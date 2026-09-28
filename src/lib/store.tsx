"use client";

import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import {
  INITIAL_PRODUCTS,
  type CartLine,
  type PaymentMethod,
  type Product,
  type Sale,
  type SaleItem,
} from "./data";
import { SEED_SALES } from "./seed-sales";

/**
 * Demo state lives entirely in memory. There is no server, no database, and no
 * persistence — a refresh restores the seeded catalog. This is the honest
 * contract of the demo, and the UI says so out loud.
 */

type State = {
  products: Product[];
  cart: CartLine[];
  sales: Sale[];
  /** True once the user changes anything, so we can warn before losing it. */
  dirty: boolean;
};

type Action =
  | { type: "addToCart"; productId: string; quantity: number }
  | { type: "removeFromCart"; productId: string }
  | { type: "setQty"; productId: string; quantity: number }
  | { type: "clearCart" }
  | {
      type: "completeSale";
      paymentMethod: PaymentMethod;
      amountTendered: number;
    }
  | { type: "adjustStock"; productId: string; stock: number }
  | { type: "upsertProduct"; product: Product }
  | { type: "reset" };

function initialState(): State {
  return {
    products: INITIAL_PRODUCTS.map((p) => ({ ...p })),
    cart: [],
    sales: SEED_SALES,
    dirty: false,
  };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "addToCart": {
      const product = state.products.find((p) => p.id === action.productId);
      if (!product) return state;
      const existing = state.cart.find((l) => l.productId === action.productId);
      const nextQty = (existing?.quantity ?? 0) + action.quantity;
      if (nextQty <= 0) return state;
      return {
        ...state,
        dirty: true,
        cart: existing
          ? state.cart.map((l) =>
              l.productId === action.productId ? { ...l, quantity: nextQty } : l,
            )
          : [...state.cart, { productId: action.productId, quantity: action.quantity }],
      };
    }

    case "removeFromCart":
      return {
        ...state,
        dirty: true,
        cart: state.cart.filter((l) => l.productId !== action.productId),
      };

    case "setQty": {
      if (action.quantity <= 0) {
        return {
          ...state,
          dirty: true,
          cart: state.cart.filter((l) => l.productId !== action.productId),
        };
      }
      return {
        ...state,
        dirty: true,
        cart: state.cart.map((l) =>
          l.productId === action.productId ? { ...l, quantity: action.quantity } : l,
        ),
      };
    }

    case "clearCart":
      return { ...state, dirty: true, cart: [] };

    case "completeSale": {
      if (state.cart.length === 0) return state;

      const items: SaleItem[] = [];
      for (const line of state.cart) {
        const product = state.products.find((p) => p.id === line.productId);
        if (!product) continue;
        items.push({
          productId: product.id,
          name: product.name,
          quantity: line.quantity,
          unitPrice: product.sellingPrice,
          lineTotal: Math.round(line.quantity * product.sellingPrice * 100) / 100,
        });
      }
      if (items.length === 0) return state;

      const subtotal =
        Math.round(items.reduce((s, it) => s + it.lineTotal, 0) * 100) / 100;
      const total = subtotal;
      const changeDue =
        Math.round((action.amountTendered - total) * 100) / 100;

      // Stock comes down the moment the sale is recorded.
      const soldQty = new Map<string, number>();
      for (const it of items) {
        soldQty.set(it.productId, (soldQty.get(it.productId) ?? 0) + it.quantity);
      }
      const products = state.products.map((p) => {
        const sold = soldQty.get(p.id);
        if (sold === undefined) return p;
        return {
          ...p,
          stock: Math.round((p.stock - sold) * 1000) / 1000,
        };
      });

      const nextReceipt =
        1000 +
        state.sales.filter((s) => !s.id.startsWith("seed-")).length +
        1;

      const sale: Sale = {
        id: `sale-${Date.now()}`,
        receiptNo: `R-${nextReceipt}`,
        items,
        subtotal,
        total,
        paymentMethod: action.paymentMethod,
        amountTendered: action.amountTendered,
        changeDue,
        createdAt: new Date().toISOString(),
      };

      return { ...state, products, cart: [], dirty: true, sales: [sale, ...state.sales] };
    }

    case "adjustStock":
      return {
        ...state,
        dirty: true,
        products: state.products.map((p) =>
          p.id === action.productId
            ? { ...p, stock: Math.max(0, Math.round(action.stock * 1000) / 1000) }
            : p,
        ),
      };

    case "upsertProduct": {
      const exists = state.products.some((p) => p.id === action.product.id);
      return {
        ...state,
        dirty: true,
        products: exists
          ? state.products.map((p) => (p.id === action.product.id ? action.product : p))
          : [...state.products, action.product],
      };
    }

    case "reset":
      return initialState();

    default:
      return state;
  }
}

type StoreValue = State & {
  cartLines: (CartLine & { product: Product })[];
  cartSubtotal: number;
  cartCount: number;
  dispatch: React.Dispatch<Action>;
};

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);

  const value = useMemo<StoreValue>(() => {
    const cartLines = state.cart.flatMap((line) => {
      const product = state.products.find((p) => p.id === line.productId);
      return product ? [{ ...line, product }] : [];
    });
    const cartSubtotal =
      Math.round(
        cartLines.reduce(
          (sum, l) => sum + l.quantity * l.product.sellingPrice,
          0,
        ) * 100,
      ) / 100;
    return {
      ...state,
      cartLines,
      cartSubtotal,
      cartCount: state.cart.reduce((s, l) => s + l.quantity, 0),
      dispatch,
    };
  }, [state]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}
