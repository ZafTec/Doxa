import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/**
 * Cart line is a snapshot of an ItemVariant at add-to-cart time, plus a
 * pointer back to the parent Item. We snapshot brand/description/color/
 * unitPrice so that catalog edits (price drops, renames) don't silently
 * change what's in someone's cart.
 *
 * `unitPrice` is in minor units (e.g. cents) per the money rule in
 * AGENTS.md — never floats.
 */
export type CartLine = {
  variantId: string;
  itemId: string;
  brand: string;
  description: string;
  color: string;
  unitPrice: number;
  image?: string;
  quantity: number;
};

export type CartState = {
  lines: CartLine[];
  add: (line: Omit<CartLine, "quantity">, quantity?: number) => void;
  remove: (variantId: string) => void;
  setQuantity: (variantId: string, quantity: number) => void;
  clear: () => void;
  totalItems: () => number;
  subtotal: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      add: (line, quantity = 1) =>
        set((state) => {
          const existing = state.lines.find((l) => l.variantId === line.variantId);
          if (existing) {
            return {
              lines: state.lines.map((l) =>
                l.variantId === line.variantId
                  ? { ...l, quantity: l.quantity + quantity }
                  : l,
              ),
            };
          }
          return { lines: [...state.lines, { ...line, quantity }] };
        }),
      remove: (variantId) =>
        set((state) => ({
          lines: state.lines.filter((l) => l.variantId !== variantId),
        })),
      setQuantity: (variantId, quantity) =>
        set((state) => ({
          lines:
            quantity <= 0
              ? state.lines.filter((l) => l.variantId !== variantId)
              : state.lines.map((l) =>
                  l.variantId === variantId ? { ...l, quantity } : l,
                ),
        })),
      clear: () => set({ lines: [] }),
      totalItems: () => get().lines.reduce((sum, l) => sum + l.quantity, 0),
      subtotal: () =>
        get().lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0),
    }),
    {
      name: "doxa.cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ lines: state.lines }),
    },
  ),
);
