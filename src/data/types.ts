import { Ionicons } from '@expo/vector-icons';

export type IconName = keyof typeof Ionicons.glyphMap;

export interface Pharmacy {
  id: string;
  name: string;
  closes: string;
  address: string;
}

export interface Product {
  id: string;
  pharmacyId: string;
  name: string;
  category: string;
  price: number;
  /** Preço "De". Se existir, o produto aparece em "Melhores ofertas". */
  oldPrice?: number;
  icon: IconName;
}

export interface CartItem {
  product: Product;
  qty: number;
}

export interface User {
  name: string;
  email: string;
  password: string;
  birth: string;
}
