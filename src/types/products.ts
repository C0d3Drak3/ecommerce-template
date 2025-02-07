export interface ProductData {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  images: string[];
  thumbnail: string;
  brand: string;
  sku?: string;
}
