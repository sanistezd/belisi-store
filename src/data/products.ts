import productsData from './products.json';

export interface Product {
  id: string;
  sku?: string;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  description: string;
  category: string;
  inStock: boolean;
}

export const defaultProducts: Product[] = productsData as Product[];
