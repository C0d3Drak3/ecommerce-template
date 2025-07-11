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
    // Limpiar la URL y forzar un refresh completo para reiniciar el estado
    window.location.href = '/';
  };

  const baseButtonClasses = "px-4 py-2 rounded-lg font-semibold text-white transition-all duration-200 transform border-b-4 active:translate-y-px active:border-b-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900";
  const primaryButtonClasses = `${baseButtonClasses} bg-blue-600 border-blue-800 hover:bg-blue-500 active:border-blue-700 focus:ring-blue-500`;
  const secondaryButtonClasses = `${baseButtonClasses} bg-gray-600 border-gray-800 hover:bg-gray-500 active:border-gray-700 focus:ring-gray-500`;
  const greenButtonClasses = `${baseButtonClasses} bg-green-600 border-green-800 hover:bg-green-500 active:border-green-700 focus:ring-green-500`;
  const redButtonClasses = `${baseButtonClasses} bg-red-600 border-red-800 hover:bg-red-500 active:border-red-700 focus:ring-red-500`;

  return (
    <nav className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-sm text-white p-4 shadow-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <button 
          onClick={handleHomeClick}
          className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 hover:opacity-90 transition-opacity"
        >
          E-Commerce Template
        </button>
        
        <div className="flex items-center space-x-4">
          {isLoading ? (
            <div className="animate-pulse flex space-x-4">
              <div className="h-10 w-24 bg-gray-700 rounded-lg"></div>
              <div className="h-10 w-24 bg-gray-700 rounded-lg"></div>
            </div>
          ) : user ? (
            <>
              <button 
                onClick={openModal}
                className={`${primaryButtonClasses} relative`}
              >
                🛒 Carrito
                {items.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-gray-900">
                    {items.length}
                  </span>
                )}
              </button>
              <Link
                href="/account"
                className={secondaryButtonClasses}
              >
                Mi Cuenta
              </Link>
              {user.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  className={greenButtonClasses}
                >
                  Panel Admin
                </Link>
              )}
              <button
                onClick={handleLogout}
                className={redButtonClasses}
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <Link 
                href="/login" 
                className={secondaryButtonClasses}
              >
                Iniciar Sesión
              </Link>
              <Link 
                href="/register" 
                className={primaryButtonClasses}
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
