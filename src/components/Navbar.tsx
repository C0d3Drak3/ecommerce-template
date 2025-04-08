'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface User {
  name: string;
  email: string;
}

const Navbar = () => {
  const [cartCount, setCartCount] = useState(0);
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();

  useEffect(() => {
    const getCartCount = async () => {
      if (!user) {
        setCartCount(0);
        return;
      }

      console.log('Obteniendo cantidad del carrito...');
      try {
        const res = await fetch('/api/cart/count');
        const data = await res.json();
        console.log('Respuesta del carrito:', data);
        
        if (data.success) {
          setCartCount(data.count);
        }
      } catch (error) {
        console.error('Error getting cart count:', error);
        setCartCount(0);
      }
    };

    getCartCount();

    // Actualizar el carrito cada 30 segundos si hay un usuario
    const interval = setInterval(() => {
      if (user) getCartCount();
    }, 30000);

    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = async () => {
    console.log('Iniciando cierre de sesión...');
    try {
      await logout();
      setCartCount(0);
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleHomeClick = () => {
    router.push('/');
  };

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <button 
          onClick={handleHomeClick}
          className="text-xl font-bold hover:text-blue-100 transition-colors"
        >
          E-Commerce Template
        </button>
        
        <div className="flex items-center space-x-4">
          {isLoading ? (
            <div className="animate-pulse flex space-x-4">
              <div className="h-8 w-20 bg-blue-300 rounded"></div>
              <div className="h-8 w-20 bg-blue-300 rounded"></div>
            </div>
          ) : user ? (
            <>
              <Link 
                href="/cart" 
                className="relative bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 transition-colors"
              >
                Carrito
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              <Link 
                href="/account" 
                className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 transition-colors"
              >
                Mi Cuenta
              </Link>
              <button
                onClick={handleLogout}
                className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition-colors"
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <Link 
                href="/login" 
                className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 transition-colors"
              >
                Iniciar Sesión
              </Link>
              <Link 
                href="/register" 
                className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition-colors"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
