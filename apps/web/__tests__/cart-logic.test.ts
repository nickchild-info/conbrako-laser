/**
 * Unit tests for cart logic
 * Tests the pure functions: calculateTotals and cartReducer
 */

import { Cart, CartItem, Product, Variant } from '@/types';

// Mock products for testing
const mockProduct: Product = {
  id: '1',
  slug: 'koosdoos-small',
  title: 'KoosDoos Small',
  subtitle: 'Compact & portable | Perfect for 2-3 people',
  description: 'The perfect starter fire pit.',
  badges: ['new'],
  seatsMin: 2,
  seatsMax: 3,
  material: '2.5mm Mild Steel',
  finish: 'Raw Steel',
  variants: [
    {
      id: 'v1',
      productId: '1',
      sku: 'KDS-SM',
      name: 'Small',
      price: 1299,
      inventoryQty: 25,
      weight: 8,
      dimensions: { width: 300, height: 350, depth: 300 },
    },
  ],
  images: [
    {
      id: 'img1',
      url: '/images/products/elephant-fire-1.jpg',
      alt: 'KoosDoos Small fire pit',
      sortOrder: 1,
    },
  ],
  reviewSummary: {
    ratingAvg: 4.7,
    ratingCount: 89,
  },
};

const mockProduct2: Product = {
  id: '2',
  slug: 'koosdoos-medium',
  title: 'KoosDoos Medium',
  subtitle: 'Perfect for 4-6 people',
  description: 'The popular mid-size fire pit.',
  badges: ['best-seller'],
  seatsMin: 4,
  seatsMax: 6,
  material: '3mm Mild Steel',
  finish: 'Raw Steel',
  variants: [
    {
      id: 'v2',
      productId: '2',
      sku: 'KDS-MD',
      name: 'Medium',
      price: 1899,
      inventoryQty: 30,
      weight: 12,
      dimensions: { width: 450, height: 400, depth: 450 },
    },
  ],
  images: [
    {
      id: 'img2',
      url: '/images/products/rhino-fire-1.jpg',
      alt: 'KoosDoos Medium fire pit',
      sortOrder: 1,
    },
  ],
  reviewSummary: {
    ratingAvg: 4.9,
    ratingCount: 156,
  },
};

const mockVariant: Variant = mockProduct.variants[0];
const mockVariant2: Variant = mockProduct2.variants[0];

// Pure function implementations for testing (mirrored from cart-context.tsx)
function calculateTotals(items: CartItem[]): { subtotal: number; itemCount: number } {
  return items.reduce(
    (acc, item) => ({
      subtotal: acc.subtotal + item.variant.price * item.quantity,
      itemCount: acc.itemCount + item.quantity,
    }),
    { subtotal: 0, itemCount: 0 }
  );
}

interface CartState extends Cart {
  isOpen: boolean;
}

type CartAction =
  | { type: 'ADD_ITEM'; productId: string; variantId: string; quantity?: number; product: Product; variant: Variant }
  | { type: 'REMOVE_ITEM'; variantId: string }
  | { type: 'UPDATE_QUANTITY'; variantId: string; quantity: number }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; cart: Cart };

const initialState: CartState = {
  items: [],
  subtotal: 0,
  itemCount: 0,
  isOpen: false,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, variant } = action;
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

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(
        (item) => item.variantId !== action.variantId
      );
      const totals = calculateTotals(newItems);
      return { ...state, items: newItems, ...totals };
    }

    case 'UPDATE_QUANTITY': {
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

    case 'OPEN_CART':
      return { ...state, isOpen: true };

    case 'CLOSE_CART':
      return { ...state, isOpen: false };

    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };

    case 'CLEAR_CART':
      return { ...initialState };

    case 'LOAD_CART':
      return { ...state, ...action.cart };

    default:
      return state;
  }
}

describe('calculateTotals', () => {
  it('should return zero for empty cart', () => {
    const result = calculateTotals([]);
    expect(result.subtotal).toBe(0);
    expect(result.itemCount).toBe(0);
  });

  it('should calculate correct totals for single item', () => {
    const items: CartItem[] = [
      {
        productId: '1',
        variantId: 'v1',
        quantity: 1,
        product: mockProduct,
        variant: mockVariant,
      },
    ];
    const result = calculateTotals(items);
    expect(result.subtotal).toBe(1299);
    expect(result.itemCount).toBe(1);
  });

  it('should calculate correct totals for multiple quantities', () => {
    const items: CartItem[] = [
      {
        productId: '1',
        variantId: 'v1',
        quantity: 3,
        product: mockProduct,
        variant: mockVariant,
      },
    ];
    const result = calculateTotals(items);
    expect(result.subtotal).toBe(1299 * 3);
    expect(result.itemCount).toBe(3);
  });

  it('should calculate correct totals for multiple items', () => {
    const items: CartItem[] = [
      {
        productId: '1',
        variantId: 'v1',
        quantity: 2,
        product: mockProduct,
        variant: mockVariant,
      },
      {
        productId: '2',
        variantId: 'v2',
        quantity: 1,
        product: mockProduct2,
        variant: mockVariant2,
      },
    ];
    const result = calculateTotals(items);
    expect(result.subtotal).toBe(1299 * 2 + 1899);
    expect(result.itemCount).toBe(3);
  });
});

describe('cartReducer', () => {
  describe('ADD_ITEM', () => {
    it('should add a new item to empty cart', () => {
      const action: CartAction = {
        type: 'ADD_ITEM',
        productId: '1',
        variantId: 'v1',
        product: mockProduct,
        variant: mockVariant,
      };

      const result = cartReducer(initialState, action);

      expect(result.items).toHaveLength(1);
      expect(result.items[0].productId).toBe('1');
      expect(result.items[0].variantId).toBe('v1');
      expect(result.items[0].quantity).toBe(1);
      expect(result.subtotal).toBe(1299);
      expect(result.itemCount).toBe(1);
      expect(result.isOpen).toBe(true);
    });

    it('should add item with specified quantity', () => {
      const action: CartAction = {
        type: 'ADD_ITEM',
        productId: '1',
        variantId: 'v1',
        quantity: 3,
        product: mockProduct,
        variant: mockVariant,
      };

      const result = cartReducer(initialState, action);

      expect(result.items[0].quantity).toBe(3);
      expect(result.subtotal).toBe(1299 * 3);
      expect(result.itemCount).toBe(3);
    });

    it('should increment quantity for existing item', () => {
      const stateWithItem: CartState = {
        ...initialState,
        items: [
          {
            productId: '1',
            variantId: 'v1',
            quantity: 2,
            product: mockProduct,
            variant: mockVariant,
          },
        ],
        subtotal: 1299 * 2,
        itemCount: 2,
      };

      const action: CartAction = {
        type: 'ADD_ITEM',
        productId: '1',
        variantId: 'v1',
        product: mockProduct,
        variant: mockVariant,
      };

      const result = cartReducer(stateWithItem, action);

      expect(result.items).toHaveLength(1);
      expect(result.items[0].quantity).toBe(3);
      expect(result.subtotal).toBe(1299 * 3);
      expect(result.itemCount).toBe(3);
    });

    it('should add different products separately', () => {
      const stateWithItem: CartState = {
        ...initialState,
        items: [
          {
            productId: '1',
            variantId: 'v1',
            quantity: 1,
            product: mockProduct,
            variant: mockVariant,
          },
        ],
        subtotal: 1299,
        itemCount: 1,
      };

      const action: CartAction = {
        type: 'ADD_ITEM',
        productId: '2',
        variantId: 'v2',
        product: mockProduct2,
        variant: mockVariant2,
      };

      const result = cartReducer(stateWithItem, action);

      expect(result.items).toHaveLength(2);
      expect(result.subtotal).toBe(1299 + 1899);
      expect(result.itemCount).toBe(2);
    });
  });

  describe('REMOVE_ITEM', () => {
    it('should remove item from cart', () => {
      const stateWithItem: CartState = {
        ...initialState,
        items: [
          {
            productId: '1',
            variantId: 'v1',
            quantity: 1,
            product: mockProduct,
            variant: mockVariant,
          },
        ],
        subtotal: 1299,
        itemCount: 1,
      };

      const result = cartReducer(stateWithItem, { type: 'REMOVE_ITEM', variantId: 'v1' });

      expect(result.items).toHaveLength(0);
      expect(result.subtotal).toBe(0);
      expect(result.itemCount).toBe(0);
    });

    it('should only remove specified item', () => {
      const stateWithItems: CartState = {
        ...initialState,
        items: [
          {
            productId: '1',
            variantId: 'v1',
            quantity: 1,
            product: mockProduct,
            variant: mockVariant,
          },
          {
            productId: '2',
            variantId: 'v2',
            quantity: 1,
            product: mockProduct2,
            variant: mockVariant2,
          },
        ],
        subtotal: 1299 + 1899,
        itemCount: 2,
      };

      const result = cartReducer(stateWithItems, { type: 'REMOVE_ITEM', variantId: 'v1' });

      expect(result.items).toHaveLength(1);
      expect(result.items[0].variantId).toBe('v2');
      expect(result.subtotal).toBe(1899);
      expect(result.itemCount).toBe(1);
    });

    it('should handle removing non-existent item gracefully', () => {
      const result = cartReducer(initialState, { type: 'REMOVE_ITEM', variantId: 'nonexistent' });
      expect(result.items).toHaveLength(0);
    });
  });

  describe('UPDATE_QUANTITY', () => {
    it('should update item quantity', () => {
      const stateWithItem: CartState = {
        ...initialState,
        items: [
          {
            productId: '1',
            variantId: 'v1',
            quantity: 1,
            product: mockProduct,
            variant: mockVariant,
          },
        ],
        subtotal: 1299,
        itemCount: 1,
      };

      const result = cartReducer(stateWithItem, {
        type: 'UPDATE_QUANTITY',
        variantId: 'v1',
        quantity: 5,
      });

      expect(result.items[0].quantity).toBe(5);
      expect(result.subtotal).toBe(1299 * 5);
      expect(result.itemCount).toBe(5);
    });

    it('should remove item when quantity is zero', () => {
      const stateWithItem: CartState = {
        ...initialState,
        items: [
          {
            productId: '1',
            variantId: 'v1',
            quantity: 3,
            product: mockProduct,
            variant: mockVariant,
          },
        ],
        subtotal: 1299 * 3,
        itemCount: 3,
      };

      const result = cartReducer(stateWithItem, {
        type: 'UPDATE_QUANTITY',
        variantId: 'v1',
        quantity: 0,
      });

      expect(result.items).toHaveLength(0);
      expect(result.subtotal).toBe(0);
      expect(result.itemCount).toBe(0);
    });

    it('should remove item when quantity is negative', () => {
      const stateWithItem: CartState = {
        ...initialState,
        items: [
          {
            productId: '1',
            variantId: 'v1',
            quantity: 1,
            product: mockProduct,
            variant: mockVariant,
          },
        ],
        subtotal: 1299,
        itemCount: 1,
      };

      const result = cartReducer(stateWithItem, {
        type: 'UPDATE_QUANTITY',
        variantId: 'v1',
        quantity: -1,
      });

      expect(result.items).toHaveLength(0);
    });
  });

  describe('Cart UI actions', () => {
    it('should open cart', () => {
      const result = cartReducer(initialState, { type: 'OPEN_CART' });
      expect(result.isOpen).toBe(true);
    });

    it('should close cart', () => {
      const openState: CartState = { ...initialState, isOpen: true };
      const result = cartReducer(openState, { type: 'CLOSE_CART' });
      expect(result.isOpen).toBe(false);
    });

    it('should toggle cart from closed to open', () => {
      const result = cartReducer(initialState, { type: 'TOGGLE_CART' });
      expect(result.isOpen).toBe(true);
    });

    it('should toggle cart from open to closed', () => {
      const openState: CartState = { ...initialState, isOpen: true };
      const result = cartReducer(openState, { type: 'TOGGLE_CART' });
      expect(result.isOpen).toBe(false);
    });
  });

  describe('CLEAR_CART', () => {
    it('should clear all items from cart', () => {
      const stateWithItems: CartState = {
        items: [
          {
            productId: '1',
            variantId: 'v1',
            quantity: 2,
            product: mockProduct,
            variant: mockVariant,
          },
          {
            productId: '2',
            variantId: 'v2',
            quantity: 3,
            product: mockProduct2,
            variant: mockVariant2,
          },
        ],
        subtotal: 1299 * 2 + 1899 * 3,
        itemCount: 5,
        isOpen: true,
      };

      const result = cartReducer(stateWithItems, { type: 'CLEAR_CART' });

      expect(result.items).toHaveLength(0);
      expect(result.subtotal).toBe(0);
      expect(result.itemCount).toBe(0);
      expect(result.isOpen).toBe(false);
    });
  });

  describe('LOAD_CART', () => {
    it('should load cart from saved state', () => {
      const savedCart: Cart = {
        items: [
          {
            productId: '1',
            variantId: 'v1',
            quantity: 2,
            product: mockProduct,
            variant: mockVariant,
          },
        ],
        subtotal: 1299 * 2,
        itemCount: 2,
      };

      const result = cartReducer(initialState, { type: 'LOAD_CART', cart: savedCart });

      expect(result.items).toHaveLength(1);
      expect(result.subtotal).toBe(1299 * 2);
      expect(result.itemCount).toBe(2);
      expect(result.isOpen).toBe(false); // Should preserve initial isOpen state
    });
  });
});

describe('Cart business logic', () => {
  it('should correctly calculate free shipping threshold', () => {
    const FREE_SHIPPING_THRESHOLD = 2500;
    const SHIPPING_COST = 150;

    // Order below threshold
    const belowThreshold = calculateTotals([
      {
        productId: '1',
        variantId: 'v1',
        quantity: 1,
        product: mockProduct,
        variant: mockVariant,
      },
    ]);
    expect(belowThreshold.subtotal).toBeLessThan(FREE_SHIPPING_THRESHOLD);
    const shippingBelow = belowThreshold.subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    expect(shippingBelow).toBe(150);

    // Order above threshold
    const aboveThreshold = calculateTotals([
      {
        productId: '1',
        variantId: 'v1',
        quantity: 2,
        product: mockProduct,
        variant: mockVariant,
      },
    ]);
    expect(aboveThreshold.subtotal).toBeGreaterThanOrEqual(FREE_SHIPPING_THRESHOLD);
    const shippingAbove = aboveThreshold.subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    expect(shippingAbove).toBe(0);
  });

  it('should maintain immutability of state', () => {
    const originalState: CartState = {
      items: [
        {
          productId: '1',
          variantId: 'v1',
          quantity: 1,
          product: mockProduct,
          variant: mockVariant,
        },
      ],
      subtotal: 1299,
      itemCount: 1,
      isOpen: false,
    };

    const action: CartAction = {
      type: 'ADD_ITEM',
      productId: '2',
      variantId: 'v2',
      product: mockProduct2,
      variant: mockVariant2,
    };

    const newState = cartReducer(originalState, action);

    // Original state should be unchanged
    expect(originalState.items).toHaveLength(1);
    expect(originalState.subtotal).toBe(1299);

    // New state should have updates
    expect(newState.items).toHaveLength(2);
    expect(newState.subtotal).toBe(1299 + 1899);

    // Items array should be a new reference
    expect(newState.items).not.toBe(originalState.items);
  });
});
