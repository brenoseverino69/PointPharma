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
  pharmacyName?: string;
  name: string;
  description?: string;
  category: string;
  price: number;
  oldPrice?: number;
  stock?: number;
  icon: IconName;
}

export interface CartItem {
  product: Product;
  qty: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  birth: string;
}
