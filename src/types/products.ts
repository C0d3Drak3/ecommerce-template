export interface ProductData {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage?: number;
  stock: number;
  images: string[];
  thumbnail: string;
  brand: string;
  sku?: string;
  tags?: string[];
  imageUrl?: string;
  thumbnailUrl?: string;
}
