'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Welcoming from '@/components/Wellcoming';
import CardContainer from '@/components/CardContainer';
import HeroSection from '@/components/HeroSection';
import AdvancedFilters from '@/components/AdvancedFilters';
import Pagination from '@/components/Pagination';

interface Product {
  id: number;
  title: string;
  price: number;
  brand: string; // Añadido para consistencia
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
  
  // Estados para filtros avanzados
  const [advancedFilters, setAdvancedFilters] = useState({
    minPrice: 0,
    maxPrice: 1000,
    selectedCategories: [] as string[],
    selectedTags: [] as string[],
    onlyDiscounted: false
  });
  
  // Manejador de cambio de filtros avanzados
  const handleAdvancedFilterChange = useCallback((filters: {
    minPrice: number;
    maxPrice: number;
    selectedCategories: string[];
    selectedTags: string[];
    onlyDiscounted: boolean;
  }) => {
    setAdvancedFilters(prev => ({
      ...prev,
      ...filters
    }));
  }, []);

  // Calcular precio máximo de los productos
  const maxPrice = useMemo(() => {
    if (products.length === 0) return 1000;
    return Math.ceil(Math.max(...products.map(p => p.price)) * 1.1); // 10% más que el precio más alto
  }, [products]);
  
  // Filtrar productos con descuento
  const discountedProducts = products.filter(product => 
    product.discountPercentage && product.discountPercentage > 0
  );
  
  // Tomar solo los primeros 4 productos con descuento para mostrar en la sección destacada
  const featuredDiscountedProducts = discountedProducts.slice(0, 4);

  const handleSearch = useCallback((searchTerm: string) => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    
    // Mantener los filtros avanzados existentes
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const discounted = searchParams.get('discounted');
    
    if (category) params.set('category', category);
    if (tag) params.set('tag', tag);
    if (discounted) params.set('discounted', discounted);
    
    const newUrl = params.toString() ? `/?${params.toString()}` : '/';
    router.push(newUrl);
  }, [router, searchParams]);

  // Effect to handle URL parameters and browser navigation
  // Effect to apply filters when products are loaded, URL changes, or advanced filters change
  useEffect(() => {
    if (products.length > 0) {
      const search = searchParams.get('search') || '';
      const category = searchParams.get('category') || '';
      const tag = searchParams.get('tag') || '';
      const discounted = searchParams.get('discounted') === 'true';
      
      // Actualizar estados de búsqueda básica
      setShowOnlyDiscounted(discounted || advancedFilters.onlyDiscounted);
      
      // Aplicar todos los filtros
      let filtered = [...products];
      let hasActiveFilters = false;

      // Aplicar filtros de búsqueda básica
      if (search) {
        const searchLower = search.toLowerCase();
        filtered = filtered.filter(product => 
          product.title.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower)
        );
        hasActiveFilters = true;
      }

      if (category) {
        filtered = filtered.filter(product => product.category === category);
        hasActiveFilters = true;
      }

      if (tag) {
        filtered = filtered.filter(product => 
          product.tags && product.tags.includes(tag)
        );
        hasActiveFilters = true;
      }
      
      // Aplicar filtros avanzados
      if (advancedFilters.minPrice > 0 || advancedFilters.maxPrice < maxPrice) {
        filtered = filtered.filter(
          product => product.price >= advancedFilters.minPrice && 
                   product.price <= advancedFilters.maxPrice
        );
        hasActiveFilters = true;
      }
      
      if (advancedFilters.selectedCategories.length > 0) {
        filtered = filtered.filter(product => 
          advancedFilters.selectedCategories.includes(product.category)
        );
        hasActiveFilters = true;
      }
      
      if (advancedFilters.selectedTags.length > 0) {
        filtered = filtered.filter(product => 
          product.tags && product.tags.some(tag => 
            advancedFilters.selectedTags.includes(tag)
          )
        );
        hasActiveFilters = true;
      }
      
      if (discounted || advancedFilters.onlyDiscounted) {
        filtered = filtered.filter(product => 
          product.discountPercentage && product.discountPercentage > 0
        );
        hasActiveFilters = true;
      }
      
      // Actualizar estado de búsqueda y productos filtrados
      setIsSearching(hasActiveFilters);
      setFilteredProducts(hasActiveFilters ? filtered : []);
    }
  }, [products, searchParams, advancedFilters, maxPrice]);

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

  // Determinar si hay una búsqueda activa basada en los parámetros de la URL
  const hasActiveSearch = searchParams.toString().length > 0;

  return (
    <main className="bg-white dark:bg-gray-900">
      <HeroSection onSearch={handleSearch} />

      <div id="products-section" className="container mx-auto px-4 py-8">
        {hasActiveSearch ? (
        // Mostrar resultados de búsqueda y filtros avanzados
        <div className="mt-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Filtros avanzados */}
            <div className="md:w-1/4 mt-8">
              <AdvancedFilters 
                categories={categories}
                tags={tags}
                maxPrice={Math.max(...products.map(p => p.price), 1000)}
                onFilterChange={handleAdvancedFilterChange}
              />
            </div>
            
            {/* Resultados de búsqueda */}
            <div className="md:w-3/4">
              {filteredProducts.length > 0 ? (
                <>
                  <CardContainer products={currentProducts} />
                  {totalPages > 1 && (
                    <div className="mt-8">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                  <p className="text-gray-600 text-lg mb-4">No se encontraron productos que coincidan con los filtros seleccionados.</p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button 
                      onClick={() => {
                        // Limpiar todos los filtros
                        router.push('/');
                        setAdvancedFilters({
                          minPrice: 0,
                          maxPrice: maxPrice,
                          selectedCategories: [],
                          selectedTags: [],
                          onlyDiscounted: false
                        });
                      }}
                      className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Limpiar filtros
                    </button>
                    <button 
                      onClick={() => {
                        // Ajustar solo el rango de precios
                        setAdvancedFilters(prev => ({
                          ...prev,
                          minPrice: 0,
                          maxPrice: maxPrice
                        }));
                      }}
                      className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                    >
                      Ajustar solo precios
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        // Mostrar contenido de bienvenida si no hay búsqueda activa
        <div>
          <Welcoming 
            products={products}
            featuredDiscountedProducts={featuredDiscountedProducts}
            onViewAllDiscounts={() => {
              const params = new URLSearchParams();
              params.set('discounted', 'true');
              router.push(`/?${params.toString()}`);
            }}
          />
          
        </div>
      )}
      </div>
    </main>
  );
}
