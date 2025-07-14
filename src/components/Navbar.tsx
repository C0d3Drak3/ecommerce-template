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
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleHomeClick = () => {
    window.location.href = '/';
  };

  const baseButtonClasses = "px-4 py-2 rounded-lg font-semibold text-white transition-all duration-200 transform border-b-4 active:translate-y-px active:border-b-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900";
  const primaryButtonClasses = `${baseButtonClasses} bg-blue-600 border-blue-800 hover:bg-blue-500 active:border-blue-700 focus:ring-blue-500`;
  const secondaryButtonClasses = `${baseButtonClasses} bg-gray-600 border-gray-800 hover:bg-gray-500 active:border-gray-700 focus:ring-gray-500`;
  const greenButtonClasses = `${baseButtonClasses} bg-green-600 border-green-800 hover:bg-green-500 active:border-green-700 focus:ring-green-500`;
  const redButtonClasses = `${baseButtonClasses} bg-red-600 border-red-800 hover:bg-red-500 active:border-red-700 focus:ring-red-500`;

  const navLinks = (
    <div className={`flex flex-col md:flex-row items-center md:space-x-4 space-y-4 md:space-y-0 w-full md:w-auto`}>
      {isLoading ? (
        <div className="animate-pulse flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="h-10 w-32 bg-gray-700 rounded-lg"></div>
          <div className="h-10 w-32 bg-gray-700 rounded-lg"></div>
        </div>
      ) : user ? (
        <>
          <button onClick={openModal} className={`${primaryButtonClasses} relative w-full md:w-auto`}>
            🛒 Carrito
            {items.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-gray-900">
                {items.length}
              </span>
            )}
          </button>
          <Link href="/account" className={`${secondaryButtonClasses} w-full md:w-auto text-center`}>Mi Cuenta</Link>
          {user.role === 'ADMIN' && (
            <Link href="/admin" className={`${greenButtonClasses} w-full md:w-auto text-center`}>Panel Admin</Link>
          )}
          <button onClick={handleLogout} className={`${redButtonClasses} w-full md:w-auto`}>Cerrar Sesión</button>
        </>
      ) : (
        <>
          <Link href="/login" className={`${secondaryButtonClasses} w-full md:w-auto text-center`}>Iniciar Sesión</Link>
          <Link href="/register" className={`${primaryButtonClasses} w-full md:w-auto text-center`}>Registrarse</Link>
        </>
      )}
    </div>
  );

  return (
    <nav className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-sm text-white p-4 shadow-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <button onClick={handleHomeClick} className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 hover:opacity-90 transition-opacity">
          E-Commerce
        </button>
        <div className="hidden md:flex md:items-center md:space-x-4">
          {navLinks}
        </div>
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16m-7 6h7'}></path>
            </svg>
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden mt-4">
          {navLinks}
        </div>
      )}
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
