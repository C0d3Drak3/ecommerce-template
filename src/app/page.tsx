'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Welcoming from '@/components/Wellcoming';
import CardContainer from '@/components/CardContainer';
import SearchFilters from '@/components/SearchFilters';
import Pagination from '@/components/Pagination';

interface Product {
  id: number;
  title: string;
  price: number;
  discountPercentage?: number;
  description: string;
  imageUrl: string;
  thumbnailUrl: string;
  category: string;
  tags: string[];
}

interface FilterState {
  searchTerm: string;
  category: string;
  tag: string;
}

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [showOnlyDiscounted, setShowOnlyDiscounted] = useState(false);
  const productsPerPage = 20;
  
  // Filtrar productos con descuento
  const discountedProducts = products.filter(product => 
    product.discountPercentage && product.discountPercentage > 0
  );
  
  // Tomar solo los primeros 4 productos con descuento para mostrar en la sección destacada
  const featuredDiscountedProducts = discountedProducts.slice(0, 4);

  const handleSearch = useCallback(({ searchTerm, category, tag }: FilterState) => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (category) params.set('category', category);
    if (tag) params.set('tag', tag);
    
    const newUrl = params.toString() ? `/?${params.toString()}` : '/';
    router.push(newUrl);
  }, [router]);

  // Effect to handle URL parameters and browser navigation
  // Effect to apply filters when products are loaded or URL changes
  useEffect(() => {
    if (products.length > 0) {
      const search = searchParams.get('search') || '';
      const category = searchParams.get('category') || '';
      const tag = searchParams.get('tag') || '';
      const discounted = searchParams.get('discounted') === 'true';
      
      setShowOnlyDiscounted(discounted);
      
      if (search || category || tag || discounted) {
        let filtered = [...products];

        if (search) {
          const searchLower = search.toLowerCase();
          filtered = filtered.filter(product => 
            product.title.toLowerCase().includes(searchLower)
          );
        }

        if (category) {
          filtered = filtered.filter(product => product.category === category);
        }

        if (tag) {
          filtered = filtered.filter(product => 
            product.tags && product.tags.includes(tag)
          );
        }
        
        if (discounted) {
          filtered = filtered.filter(product => 
            product.discountPercentage && product.discountPercentage > 0
          );
        }

        setIsSearching(true);
        setFilteredProducts(filtered);
      } else {
        setIsSearching(false);
        setFilteredProducts([]);
      }
    }
  }, [products, searchParams]);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Error en la respuesta del servidor');
        }

        const data = await response.json();
        
        if (!isMounted) return;

        if (!data.success) {
          throw new Error(data.message || 'Error al obtener productos');
        }
        
        if (!Array.isArray(data.products)) {
          throw new Error('Formato de datos inválido');
        }

        const productsData = data.products;
        
        // Extraer categorías y tags únicos una sola vez
        const uniqueCategories = Array.from(new Set(productsData.map((p: Product) => p.category))) as string[];
        const uniqueTags = Array.from(new Set(productsData.flatMap((p: Product) => p.tags || []))) as string[];
        
        if (isMounted) {
          setProducts(productsData);
          setCategories(uniqueCategories);
          setTags(uniqueTags);
          setFilteredProducts([]); // Resetear productos filtrados
          setIsSearching(false); // Resetear estado de búsqueda
          setCurrentPage(1); // Resetear página
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error fetching products:', error);
          setError(error instanceof Error ? error.message : 'Error desconocido');
          setProducts([]);
          setCategories([]);
          setTags([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []); // Solo se ejecuta una vez al montar el componente

  // Calcular productos actuales basados en la página actual
  const currentProducts = isSearching
    ? filteredProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage)
    : [];

  // Mostrar mensaje cuando no hay productos con descuento
  if (showOnlyDiscounted && filteredProducts.length === 0) {
    return (
      <main className="container mx-auto px-4 py-8 bg-gray-600 min-h-[60vh]">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-white mb-4">No hay productos en descuento en este momento</h2>
          <p className="text-gray-300 mb-6">Pronto tendremos nuevas ofertas especiales para ti.</p>
          <button 
            onClick={() => {
              setShowOnlyDiscounted(false);
              router.push('/');
            }}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Ver todos los productos
          </button>
        </div>
      </main>
    );
  }

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="mb-2 text-lg">Cargando productos...</div>
          <div className="text-sm text-gray-500">Por favor espera un momento</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-xl text-red-600 mb-2">Error</div>
          <div className="text-gray-600">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8 bg-gray-600">
      <SearchFilters
        onSearch={handleSearch}
        categories={categories}
        tags={tags}
      />
      
      <div className={isSearching ? 'hidden' : 'block'}>
        <Welcoming products={products} />
        
        {/* Sección de productos en descuento */}
        {featuredDiscountedProducts.length > 0 && (
          <div className="mt-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">🔥 Ofertas Especiales</h2>
              <button 
                onClick={() => {
                  // Filtrar solo productos con descuento
                  const params = new URLSearchParams();
                  params.set('discounted', 'true');
                  router.push(`/?${params.toString()}`);
                }}
                className="text-blue-400 hover:text-blue-300 text-sm font-medium"
              >
                Ver todos los descuentos →
              </button>
            </div>
            <CardContainer 
              products={featuredDiscountedProducts} 
            />
          </div>
        )}
      </div>
      
      {isSearching && filteredProducts.length > 0 && (
        <div className="mt-8">
          <CardContainer products={currentProducts} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {isSearching && filteredProducts.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">No se encontraron productos que coincidan con tu búsqueda.</p>
          <button 
            onClick={() => {
              setIsSearching(false);
              setFilteredProducts([]);
            }} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Volver al inicio
          </button>
        </div>
      )}
    </main>
  );
}
