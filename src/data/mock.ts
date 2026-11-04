import { Pharmacy, Product } from './types';

export const pharmacies: Pharmacy[] = [
  { id: 'p1', name: 'Multidrogas Centro I', closes: '22:00', address: 'Av. Central, 120' },
  { id: 'p2', name: 'Farmais - Cia das Fórmulas', closes: '20:30', address: 'Rua das Flores, 45' },
  { id: 'p3', name: 'Drogaria Total Popular', closes: '20:00', address: 'Praça da Matriz, 8' },
];

export const products: Product[] = [
  { id: 'a1', pharmacyId: 'p1', name: 'Decongex', category: 'Nasal', price: 7.0, oldPrice: 11.0, icon: 'water' },
  { id: 'a2', pharmacyId: 'p1', name: 'Allegra', category: 'Alergia', price: 27.0, oldPrice: 35.0, icon: 'flower' },
  { id: 'a3', pharmacyId: 'p1', name: 'Florent 200mg', category: 'Antibiótico', price: 22.0, icon: 'medkit' },
  { id: 'a4', pharmacyId: 'p1', name: 'Alenia 6 mcg + 200 mcg', category: 'Respiratório', price: 89.9, icon: 'fitness' },
  { id: 'a5', pharmacyId: 'p1', name: 'Fluoxetina', category: 'Controlado', price: 10.59, icon: 'medical' },
  { id: 'b1', pharmacyId: 'p2', name: 'Dipirona 500mg', category: 'Analgésico', price: 6.5, oldPrice: 9.9, icon: 'bandage' },
  { id: 'b2', pharmacyId: 'p2', name: 'Vitamina C 1g', category: 'Vitaminas', price: 18.9, icon: 'nutrition' },
  { id: 'b3', pharmacyId: 'p2', name: 'Protetor Solar FPS 50', category: 'Dermocosméticos', price: 42.0, oldPrice: 55.0, icon: 'sunny' },
  { id: 'c1', pharmacyId: 'p3', name: 'Paracetamol 750mg', category: 'Analgésico', price: 8.2, icon: 'medkit' },
  { id: 'c2', pharmacyId: 'p3', name: 'Soro Fisiológico', category: 'Higiene', price: 5.0, oldPrice: 7.5, icon: 'water' },
  { id: 'c3', pharmacyId: 'p3', name: 'Omeprazol 20mg', category: 'Gástrico', price: 12.4, icon: 'medical' },
];

export const pharmacyById = (id: string): Pharmacy | undefined =>
  pharmacies.find((p) => p.id === id);
