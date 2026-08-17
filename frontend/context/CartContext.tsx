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
import { getCartTotal } from "@/lib/pricing";
import { trackEvent } from "@/lib/track";
import CartDrawer from "@/components/CartDrawer";
import CheckoutPopup from "@/components/CheckoutPopup";
import UpsellModal from "@/components/UpsellModal";

export type CartItem = { slug: ProductSlug; qty: number; sku: string };

type CheckoutData = { name: string; phone: string };

type State = {
  items: CartItem[];
  isDrawerOpen: boolean;
  isCheckoutOpen: boolean;
  isUpsellOpen: boolean;
  checkoutData: CheckoutData | null;
};

type Action =
  | { type: "ADD"; slug: ProductSlug; qty: number; sku: string }
  | { type: "ADD_SLUG"; slug: ProductSlug }
  | { type: "REMOVE"; slug: ProductSlug }
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

function cartReducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD": {
      const existing = state.items.find((i) => i.slug === action.slug);
      const items = existing
        ? state.items.map((i) =>
            i.slug === action.slug ? { ...i, qty: action.qty, sku: action.sku } : i
          )
        : [...state.items, { slug: action.slug, qty: action.qty, sku: action.sku }];
      return { ...state, items, isDrawerOpen: true };
    }
    case "ADD_SLUG": {
      const product = getProductOrThrow(action.slug);
      const existing = state.items.find((i) => i.slug === action.slug);
      if (existing) {
        return { ...state, isDrawerOpen: true };
      }
      return {
        ...state,
        items: [...state.items, { slug: action.slug, qty: 1, sku: product.sku }],
        isDrawerOpen: true,
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
  addSlug: (slug: ProductSlug) => void;
  removeFromCart: (slug: ProductSlug) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  openCheckout: () => void;
  openUpsell: (name: string, phone: string) => void;
  closeCheckout: () => void;
  closeAll: () => void;
  clearCart: () => void;
  itemCount: number;
  total: number;
  cartSlugs: ProductSlug[];
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addToCart = useCallback((slug: ProductSlug, qty: number) => {
    const product = getProductOrThrow(slug);
    dispatch({ type: "ADD", slug, qty, sku: product.sku });
    trackEvent("add_to_cart", { product_slug: slug });
  }, []);

  const addSlug = useCallback((slug: ProductSlug) => {
    dispatch({ type: "ADD_SLUG", slug });
    trackEvent("add_to_cart", { product_slug: slug });
  }, []);

  const removeFromCart = useCallback((slug: ProductSlug) => {
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

  const total = useMemo(() => getCartTotal(state.items), [state.items]);

  const value: CartContextValue = {
    state,
    addToCart,
    addSlug,
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
