'use client';
import { useEffect, useState, use } from 'react';
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

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${resolvedParams.id}`);
        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message);
        }

        setProduct(data.product);
      } catch (error) {
        console.error('Error:', error);
        setError(error instanceof Error ? error.message : 'Error al cargar el producto');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [resolvedParams.id]);

  const handleQuantityChange = (value: number) => {
    if (product && value >= 1 && value <= (product.stock || 1)) {
      setQuantity(value);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold mb-2">Cargando producto...</div>
          <div className="text-gray-500">Por favor espera</div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600 mb-2">Error</div>
          <div className="text-gray-700 mb-4">{error || 'Producto no encontrado'}</div>
          <Link href="/" className="text-blue-600 hover:underline">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
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
              Stock disponible: {product.stock || 0} unidades
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label htmlFor="quantity" className="text-gray-700">
                Cantidad:
              </label>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  className="px-3 py-1 border rounded-md hover:bg-gray-100"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <input
                  type="number"
                  id="quantity"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                  className="w-16 text-center border rounded-md py-1"
                  min="1"
                  max={product.stock}
                />
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="px-3 py-1 border rounded-md hover:bg-gray-100"
                  disabled={quantity >= (product.stock || 1)}
                >
                  +
                </button>
              </div>
            </div>

            <button 
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400"
              disabled={!product.stock}
            >
              {product.stock ? 'Agregar al carrito' : 'Sin stock'}
            </button>
          </div>

          {/* Información adicional */}
          <div className="border-t pt-6 space-y-4">
            {product.brand && (
              <div>
                <h3 className="font-semibold text-gray-900">Marca</h3>
                <p className="text-gray-600">{product.brand}</p>
              </div>
            )}
            
            {product.tags && product.tags.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900">Etiquetas</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {product.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600"
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
}
