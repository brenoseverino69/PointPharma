import React, { createContext, ReactNode, useContext, useMemo, useReducer } from 'react';
import { Alert } from 'react-native';
import { CartItem, Product } from '@/data/types';

type Action =
  | { type: 'add'; product: Product }
  | { type: 'dec'; id: string }
  | { type: 'remove'; id: string }
  | { type: 'clear' };

interface CartValue {
  items: CartItem[];
  count: number;
  total: number;
  add: (product: Product) => void;
  dec: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartValue | null>(null);

function reducer(state: CartItem[], action: Action): CartItem[] {
  switch (action.type) {
    case 'add': {
      const exists = state.find((i) => i.product.id === action.product.id);
      const estoque = action.product.stock;

      if (estoque !== undefined && estoque <= (exists?.qty ?? 0)) {
        Alert.alert('Estoque máximo', `Há somente ${estoque} unidade(s) disponíveis de ${action.product.name}.`);
        return state;
      }

      if (exists) {
        return state.map((i) =>
          i.product.id === action.product.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...state, { product: action.product, qty: 1 }];
    }
    case 'dec':
      return state
        .map((i) => (i.product.id === action.id ? { ...i, qty: i.qty - 1 } : i))
        .filter((i) => i.qty > 0);
    case 'remove':
      return state.filter((i) => i.product.id !== action.id);
    case 'clear':
      return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(reducer, []);

  const value = useMemo<CartValue>(
    () => ({
      items,
      count: items.reduce((s, i) => s + i.qty, 0),
      total: items.reduce((s, i) => s + i.qty * i.product.price, 0),
      add: (product) => dispatch({ type: 'add', product }),
      dec: (id) => dispatch({ type: 'dec', id }),
      remove: (id) => dispatch({ type: 'remove', id }),
      clear: () => dispatch({ type: 'clear' }),
    }),
    [items]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart deve ser usado dentro de CartProvider');
  return ctx;
}
