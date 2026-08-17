"use client";

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import { ProductSlug, getProductOrThrow } from "@/data/products";
import { type PackId, getPack, isPackId } from "@/data/packs";
import { getCartTotal } from "@/lib/pricing";
import { trackEvent } from "@/lib/track";
import CartDrawer from "@/components/CartDrawer";
import CheckoutPopup from "@/components/CheckoutPopup";
import UpsellModal from "@/components/UpsellModal";

export type CartSlug = ProductSlug | PackId;
export type CartItem = { slug: CartSlug; qty: number; sku: string };

type CheckoutData = { name: string; phone: string };

type State = {
  items: CartItem[];
  isDrawerOpen: boolean;
  isCheckoutOpen: boolean;
  isUpsellOpen: boolean;
  checkoutData: CheckoutData | null;
};

type Action =
  | { type: "ADD"; slug: ProductSlug; qty: number; sku: string; dest?: "drawer" | "checkout" }
  | { type: "ADD_SLUG"; slug: ProductSlug }
  | { type: "ADD_PACK"; packId: PackId; dest?: "drawer" | "checkout" }
  | { type: "SET_QTY"; slug: CartSlug; qty: number }
  | { type: "REMOVE"; slug: CartSlug }
  | { type: "OPEN_DRAWER" }
  | { type: "CLOSE_DRAWER" }
  | { type: "OPEN_CHECKOUT" }
  | { type: "CLOSE_CHECKOUT" }
  | { type: "OPEN_UPSELL"; name: string; phone: string }
  | { type: "CLOSE_UPSELL" }
  | { type: "CLOSE_ALL" }
  | { type: "CLEAR" };

const initialState: State = {
  items: [],
  isDrawerOpen: false,
  isCheckoutOpen: false,
  isUpsellOpen: false,
  checkoutData: null,
};

function withoutPacks(items: CartItem[]): CartItem[] {
  return items.filter((item) => !isPackId(item.slug));
}

function cartReducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD": {
      const items = withoutPacks(state.items);
      const existing = items.find((i) => i.slug === action.slug);
      const next = existing
        ? items.map((i) =>
            i.slug === action.slug ? { ...i, qty: action.qty, sku: action.sku } : i
          )
        : [...items, { slug: action.slug, qty: action.qty, sku: action.sku }];
      const dest = action.dest ?? "drawer";
      return {
        ...state,
        items: next,
        isDrawerOpen: dest === "drawer",
        isCheckoutOpen: dest === "checkout",
      };
    }
    case "ADD_SLUG": {
      const product = getProductOrThrow(action.slug);
      const items = withoutPacks(state.items);
      const existing = items.find((i) => i.slug === action.slug);
      const stayInCheckout = state.isCheckoutOpen;
      if (existing) {
        return {
          ...state,
          items,
          isDrawerOpen: !stayInCheckout,
          isCheckoutOpen: stayInCheckout,
        };
      }
      return {
        ...state,
        items: [...items, { slug: action.slug, qty: 1, sku: product.sku }],
        isDrawerOpen: !stayInCheckout,
        isCheckoutOpen: stayInCheckout,
      };
    }
    case "ADD_PACK": {
      const pack = getPack(action.packId);
      if (!pack) return state;
      const dest = action.dest ?? "drawer";
      return {
        ...state,
        items: [{ slug: pack.id, qty: 1, sku: pack.sku }],
        isDrawerOpen: dest === "drawer",
        isCheckoutOpen: dest === "checkout",
      };
    }
    case "SET_QTY": {
      if (isPackId(action.slug)) return state;
      const qty = Math.min(3, Math.max(0, action.qty));
      if (qty < 1) {
        return { ...state, items: state.items.filter((i) => i.slug !== action.slug) };
      }
      return {
        ...state,
        items: state.items.map((item) => (item.slug === action.slug ? { ...item, qty } : item)),
      };
    }
    case "REMOVE":
      return { ...state, items: state.items.filter((i) => i.slug !== action.slug) };
    case "OPEN_DRAWER":
      return { ...state, isDrawerOpen: true };
    case "CLOSE_DRAWER":
      return { ...state, isDrawerOpen: false };
    case "OPEN_CHECKOUT":
      return { ...state, isDrawerOpen: false, isCheckoutOpen: true };
    case "CLOSE_CHECKOUT":
      return { ...state, isCheckoutOpen: false };
    case "OPEN_UPSELL":
      return {
        ...state,
        isCheckoutOpen: false,
        isUpsellOpen: true,
        checkoutData: { name: action.name, phone: action.phone },
      };
    case "CLOSE_UPSELL":
      return { ...state, isUpsellOpen: false };
    case "CLOSE_ALL":
      return {
        ...state,
        isDrawerOpen: false,
        isCheckoutOpen: false,
        isUpsellOpen: false,
        checkoutData: null,
      };
    case "CLEAR":
      return { ...initialState };
    default:
      return state;
  }
}

type CartContextValue = {
  state: State;
  addToCart: (slug: ProductSlug, qty: number) => void;
  buyNow: (slug: ProductSlug, qty: number) => void;
  addSlug: (slug: ProductSlug) => void;
  addPack: (packId: PackId) => void;
  buyPack: (packId: PackId) => void;
  setQty: (slug: CartSlug, qty: number) => void;
  removeFromCart: (slug: CartSlug) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  openCheckout: () => void;
  openUpsell: (name: string, phone: string) => void;
  closeCheckout: () => void;
  closeAll: () => void;
  clearCart: () => void;
  itemCount: number;
  total: number;
  cartSlugs: CartSlug[];
  hasPack: boolean;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addToCart = useCallback((slug: ProductSlug, qty: number) => {
    const product = getProductOrThrow(slug);
    dispatch({ type: "ADD", slug, qty, sku: product.sku, dest: "drawer" });
    trackEvent("add_to_cart", { product_slug: slug });
  }, []);

  const buyNow = useCallback((slug: ProductSlug, qty: number) => {
    const product = getProductOrThrow(slug);
    dispatch({ type: "ADD", slug, qty, sku: product.sku, dest: "checkout" });
    trackEvent("add_to_cart", { product_slug: slug });
  }, []);

  const addSlug = useCallback((slug: ProductSlug) => {
    dispatch({ type: "ADD_SLUG", slug });
    trackEvent("add_to_cart", { product_slug: slug });
  }, []);

  const addPack = useCallback((packId: PackId) => {
    dispatch({ type: "ADD_PACK", packId, dest: "drawer" });
    trackEvent("add_to_cart", { product_slug: packId });
  }, []);

  const buyPack = useCallback((packId: PackId) => {
    dispatch({ type: "ADD_PACK", packId, dest: "checkout" });
    trackEvent("add_to_cart", { product_slug: packId });
  }, []);

  const setQty = useCallback((slug: CartSlug, qty: number) => {
    dispatch({ type: "SET_QTY", slug, qty });
  }, []);

  const removeFromCart = useCallback((slug: CartSlug) => {
    dispatch({ type: "REMOVE", slug });
  }, []);

  const itemCount = useMemo(
    () => state.items.reduce((sum, i) => sum + i.qty, 0),
    [state.items]
  );

  const cartSlugs = useMemo(
    () => state.items.map((i) => i.slug),
    [state.items]
  );

  const hasPack = useMemo(() => state.items.some((i) => isPackId(i.slug)), [state.items]);

  const total = useMemo(() => getCartTotal(state.items), [state.items]);

  const value: CartContextValue = {
    state,
    addToCart,
    buyNow,
    addSlug,
    addPack,
    buyPack,
    setQty,
    removeFromCart,
    openDrawer: () => dispatch({ type: "OPEN_DRAWER" }),
    closeDrawer: () => dispatch({ type: "CLOSE_DRAWER" }),
    openCheckout: () => dispatch({ type: "OPEN_CHECKOUT" }),
    openUpsell: (name, phone) => dispatch({ type: "OPEN_UPSELL", name, phone }),
    closeCheckout: () => dispatch({ type: "CLOSE_CHECKOUT" }),
    closeAll: () => dispatch({ type: "CLOSE_ALL" }),
    clearCart: () => dispatch({ type: "CLEAR" }),
    itemCount,
    total,
    cartSlugs,
    hasPack,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
      <CartDrawer />
      <CheckoutPopup />
      <UpsellModal />
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
