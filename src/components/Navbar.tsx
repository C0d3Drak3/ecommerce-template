'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import CartModal from './CartModal';

function NavbarContent() {
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const { items, openModal } = useCart();

  const handleLogout = async () => {
    try {
      await logout();
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
          className="text-xl font-bold transition-colors duration-500 hover:text-purple-900"
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
              <button 
                onClick={openModal}
                className="relative bg-gray-200 text-blue-600 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors duration-300 font-semibold shadow-md shadow-slate-800"
              >
                Carrito
                {items.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {items.length}
                  </span>
                )}
              </button>
              <Link
                href="/account"
                className="bg-gray-200 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md transition-colors duration-300 font-semibold shadow-md shadow-slate-800"
              >
                Mi Cuenta
              </Link>
              {user.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors duration-300 font-semibold shadow-md shadow-slate-800"
                >
                  Panel Admin
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-red-500 hover:text-gray-800 transition-colors duration-300 font-semibold shadow-md shadow-slate-800"
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
                className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition-colors "
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default function Navbar() {
  return (
    <>
      <NavbarContent />
      <CartModal />
    </>
  );
}
