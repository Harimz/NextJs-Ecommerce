import { create } from "zustand";

type CartUiState = {
  isOpen: boolean;
  lastAddedVariantId: string | null;

  open: () => void;
  close: () => void;
  toggle: () => void;

  setLastAdded: (variantId: string | null) => void;
};

export const useCartUiStore = create<CartUiState>((set) => ({
  isOpen: false,
  lastAddedVariantId: null,

  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),

  setLastAdded: (variantId) => set({ lastAddedVariantId: variantId }),
}));
