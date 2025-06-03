'use client';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';

interface Product {
  id?: number;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  stock: number;
  category: string;
  thumbnail: string;
  brand: string;
  tags: string[];
}

interface ProductFormProps {
  initialData?: Product;
  mode: 'create' | 'edit';
}

export default function ProductForm({ initialData, mode }: ProductFormProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [previewThumbnail, setPreviewThumbnail] = useState('');
  const [imageError, setImageError] = useState(false);
  const [thumbnailError, setThumbnailError] = useState(false);
  const [priceError, setPriceError] = useState('');
  
  // Componente de imagen segura que maneja errores
  const SafeImage = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
    const [hasError, setHasError] = useState(false);
    
    if (hasError || !src) {
      return (
        <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
          <span className="text-gray-500 text-sm">Imagen no disponible</span>
        </div>
      );
    }
    
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={className}
        onError={() => setHasError(true)}
        unoptimized={src.startsWith('http')} // Desactiva la optimización para imágenes externas
      />
    );
  };

  const [formData, setFormData] = useState<Product>({
    title: '',
    description: '',
    imageUrl: '',
    price: 0,
    stock: 0,
    category: '',
    thumbnail: '',
    brand: '',
    tags: [],
    ...initialData
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    if (user.role !== 'ADMIN') {
      router.push('/');
      return;
    }
  }, [user, router]);

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handlePriceBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value && !/^\d+\.\d{2}$/.test(value)) {
      setPriceError('El precio debe tener exactamente 2 decimales (ej: 9.99)');
    } else {
      setPriceError('');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Limpiar el error de precio si el usuario está editando
    if (name === 'price' && priceError) {
      setPriceError('');
    }
    
    if (name === 'tags') {
      setFormData(prev => ({
        ...prev,
        tags: value.split(',').map(tag => tag.trim())
      }));
    } else if (name === 'imageUrl') {
      const url = value.trim();
      if (url && isValidUrl(url)) {
        setImageError(false);
        setPreviewImage(url);
      } else if (url) {
        setImageError(true);
      } else {
        setImageError(false);
        setPreviewImage('');
      }
      setFormData(prev => ({ ...prev, [name]: url }));
    } else if (name === 'thumbnail') {
      const url = value.trim();
      if (url && isValidUrl(url)) {
        setThumbnailError(false);
        setPreviewThumbnail(url);
      } else if (url) {
        setThumbnailError(true);
      } else {
        setThumbnailError(false);
        setPreviewThumbnail('');
      }
      setFormData(prev => ({ ...prev, [name]: url }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const url = '/api/admin/products';
      const method = mode === 'create' ? 'POST' : 'PUT';
      const body = mode === 'create' ? formData : { ...formData, id: initialData?.id };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.success) {
        router.push('/admin/products');
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error submitting product:', error);
      setError('Error al guardar el producto');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || user.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        {mode === 'create' ? 'Crear Nuevo Producto' : 'Editar Producto'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Título
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-600 border-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-600"
            />
          </div>

          {/* Marca */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Marca
            </label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-600 border-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-600"
            />
          </div>

          {/* Precio */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Precio
            </label>
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleChange}
              onBlur={handlePriceBlur}
              placeholder="0.00"
              className="mt-1 block w-full rounded-md border-gray-600 border-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-600"
            />
            {priceError && (
              <p className="mt-1 text-sm text-red-600">{priceError}</p>
            )}
          </div>

          {/* Stock */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Stock
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
              min="0"
              className="mt-1 block w-full rounded-md border-gray-600 border-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-600"
            />
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Categoría
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-600 border-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-600"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tags (separados por coma)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags.join(', ')}
              onChange={handleChange}
              placeholder="ej: electrónica, gadgets, nuevo"
              className="mt-1 block w-full rounded-md border-gray-600 border-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-600"
            />
          </div>
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Descripción
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-600 border-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-600"
          />
        </div>

        {/* URLs de imágenes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              URL de Imagen Principal
            </label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-600 border-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-600"
            />
            <div className="mt-2 relative h-40 w-full border rounded-md overflow-hidden">
              {previewImage ? (
                <SafeImage 
                  src={previewImage} 
                  alt="Preview"
                  className="object-contain"
                />
              ) : (
                <div className="h-full bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400">Vista previa</span>
                </div>
              )}
              {imageError && (
                <div className="absolute inset-0 bg-red-50 border border-red-200 rounded-md flex items-center justify-center p-2">
                  <span className="text-red-600 text-sm">URL de imagen inválida</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              URL de Thumbnail
            </label>
            <input
              type="url"
              name="thumbnail"
              value={formData.thumbnail}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-600 border-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <div className="mt-2 relative h-40 w-full border rounded-md overflow-hidden">
              {previewThumbnail ? (
                <SafeImage 
                  src={previewThumbnail} 
                  alt="Thumbnail Preview"
                  className="object-contain"
                />
              ) : (
                <div className="h-full bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400">Vista previa</span>
                </div>
              )}
              {thumbnailError && (
                <div className="absolute inset-0 bg-red-50 border border-red-200 rounded-md flex items-center justify-center p-2">
                  <span className="text-red-600 text-sm">URL de thumbnail inválida</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push('/admin/products')}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading || !!priceError}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${priceError ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLoading ? 'Guardando...' : mode === 'create' ? 'Crear Producto' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  );
}
