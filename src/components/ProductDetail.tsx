// components/ProductDetail.tsx
'use client';
import Image from 'next/image';
import Link from 'next/link';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
  brand: string;
  tags: string[];
}

interface ProductDetailProps {
  product: Product;
  quantity: number;
  onQuantityChange: (value: number) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({
  product,
  quantity,
  onQuantityChange,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-slate-400">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Imagen del producto */}
        <div className="relative h-96 md:h-[600px]">
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            className="rounded-lg object-cover"
            priority
          />
        </div>

        {/* Detalles del producto */}
        <div className="space-y-6">
          <div>
            <p className="text-sm text-gray-500 uppercase">{product.category}</p>
            <h1 className="text-3xl font-bold mt-1">{product.title}</h1>
            <p className="text-gray-600 mt-2">{product.description}</p>
          </div>

          <div>
            <p className="text-3xl font-bold text-blue-600">
              ${product.price.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Stock disponible: {product.stock} unidades
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center border rounded-md">
              <button
                onClick={() => onQuantityChange(quantity - 1)}
                className="px-3 py-1 text-xl border-r hover:bg-gray-100"
                disabled={quantity <= 1}
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => onQuantityChange(parseInt(e.target.value) || 1)}
                className="w-16 text-center py-1 focus:outline-none"
                min="1"
                max={product.stock}
              />
              <button
                onClick={() => onQuantityChange(quantity + 1)}
                className="px-3 py-1 text-xl border-l hover:bg-gray-100"
                disabled={quantity >= product.stock}
              >
                +
              </button>
            </div>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
              Agregar al carrito
            </button>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Detalles adicionales:</h3>
            <p className="text-gray-600">Marca: {product.brand}</p>
            {product.tags && product.tags.length > 0 && (
              <div className="mt-2">
                <p className="font-semibold mb-1">Etiquetas:</p>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 px-2 py-1 rounded-md text-sm text-gray-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
