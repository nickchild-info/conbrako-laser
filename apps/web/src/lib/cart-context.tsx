"use client";

import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from "react";
import { Cart, CartItem, Product, Variant } from "@/types";
import { products } from "@/data/products";

interface CartState extends Cart {
  isOpen: boolean;
}

type CartAction =
  | { type: "ADD_ITEM"; productId: string; variantId: string; quantity?: number }
  | { type: "REMOVE_ITEM"; variantId: string }
  | { type: "UPDATE_QUANTITY"; variantId: string; quantity: number }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" }
  | { type: "TOGGLE_CART" }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; cart: Cart };

const initialState: CartState = {
  items: [],
  subtotal: 0,
  itemCount: 0,
  isOpen: false,
};

function findProductAndVariant(
  productId: string,
  variantId: string
): { product: Product; variant: Variant } | null {
  const product = products.find((p) => p.id === productId);
  if (!product) return null;
  const variant = product.variants.find((v) => v.id === variantId);
  if (!variant) return null;
  return { product, variant };
}

function calculateTotals(items: CartItem[]): { subtotal: number; itemCount: number } {
  return items.reduce(
    (acc, item) => ({
      subtotal: acc.subtotal + item.variant.price * item.quantity,
      itemCount: acc.itemCount + item.quantity,
    }),
    { subtotal: 0, itemCount: 0 }
  );
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const result = findProductAndVariant(action.productId, action.variantId);
      if (!result) return state;

      const { product, variant } = result;
      const existingItemIndex = state.items.findIndex(
        (item) => item.variantId === action.variantId
      );

      let newItems: CartItem[];
      if (existingItemIndex >= 0) {
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + (action.quantity || 1) }
            : item
        );
      } else {
        newItems = [
          ...state.items,
          {
            productId: action.productId,
            variantId: action.variantId,
            quantity: action.quantity || 1,
            product,
            variant,
          },
        ];
      }

      const totals = calculateTotals(newItems);
      return { ...state, items: newItems, ...totals, isOpen: true };
    }

    case "REMOVE_ITEM": {
      const newItems = state.items.filter(
        (item) => item.variantId !== action.variantId
      );
      const totals = calculateTotals(newItems);
      return { ...state, items: newItems, ...totals };
    }

    case "UPDATE_QUANTITY": {
      if (action.quantity <= 0) {
        const newItems = state.items.filter(
          (item) => item.variantId !== action.variantId
        );
        const totals = calculateTotals(newItems);
        return { ...state, items: newItems, ...totals };
      }

      const newItems = state.items.map((item) =>
        item.variantId === action.variantId
          ? { ...item, quantity: action.quantity }
          : item
      );
      const totals = calculateTotals(newItems);
      return { ...state, items: newItems, ...totals };
    }

    case "OPEN_CART":
      return { ...state, isOpen: true };

    case "CLOSE_CART":
      return { ...state, isOpen: false };

    case "TOGGLE_CART":
      return { ...state, isOpen: !state.isOpen };

    case "CLEAR_CART":
      return { ...initialState };

    case "LOAD_CART":
      return { ...state, ...action.cart };

    default:
      return state;
  }
}

interface CartContextValue extends CartState {
  addItem: (productId: string, variantId: string, quantity?: number) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("conbrako-cart");
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        // Rehydrate products and variants from current data
        const rehydratedItems: CartItem[] = parsed.items
          .map((item: { productId: string; variantId: string; quantity: number }) => {
            const result = findProductAndVariant(item.productId, item.variantId);
            if (!result) return null;
            return {
              ...item,
              product: result.product,
              variant: result.variant,
            };
          })
          .filter(Boolean);
        const totals = calculateTotals(rehydratedItems);
        dispatch({
          type: "LOAD_CART",
          cart: { items: rehydratedItems, ...totals },
        });
      } catch (e) {
        console.error("Failed to load cart from localStorage", e);
      }
    }
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    const cartData = {
      items: state.items.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
      })),
    };
    localStorage.setItem("conbrako-cart", JSON.stringify(cartData));
  }, [state.items]);

  const value: CartContextValue = {
    ...state,
    addItem: (productId, variantId, quantity) =>
      dispatch({ type: "ADD_ITEM", productId, variantId, quantity }),
    removeItem: (variantId) => dispatch({ type: "REMOVE_ITEM", variantId }),
    updateQuantity: (variantId, quantity) =>
      dispatch({ type: "UPDATE_QUANTITY", variantId, quantity }),
    openCart: () => dispatch({ type: "OPEN_CART" }),
    closeCart: () => dispatch({ type: "CLOSE_CART" }),
    toggleCart: () => dispatch({ type: "TOGGLE_CART" }),
    clearCart: () => dispatch({ type: "CLEAR_CART" }),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
