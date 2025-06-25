import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaShieldAlt, FaHeadset, FaTruck, FaCreditCard } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white border-t border-gray-800 mt-12">
      {/* Sección de servicios */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="flex items-center space-x-3">
            <FaTruck className="text-blue-400 text-2xl" />
            <div>
              <h3 className="font-semibold text-blue-300">Envío Gratis</h3>
              <p className="text-sm text-gray-300">En compras superiores a $20.000</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <FaShieldAlt className="text-green-400 text-2xl" />
            <div>
              <h3 className="font-semibold text-green-300">Pago Seguro</h3>
              <p className="text-sm text-gray-300">100% protegido</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <FaHeadset className="text-purple-400 text-2xl" />
            <div>
              <h3 className="font-semibold text-purple-300">Soporte 24/7</h3>
              <p className="text-sm text-gray-300">Estamos para ayudarte</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <FaCreditCard className="text-yellow-400 text-2xl" />
            <div>
              <h3 className="font-semibold text-yellow-300">Hasta 12 cuotas</h3>
              <p className="text-sm text-gray-300">Sin interés con bancos seleccionados</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Columna 1: Contacto */}
            <div>
              <h3 className="text-lg font-bold text-blue-400 mb-4">Contáctanos</h3>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <span className="text-blue-300">📧</span>
                  <span className="text-gray-300 hover:text-white">contacto@ecommerce.com</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-blue-300">📞</span>
                  <span className="text-gray-300">+54 11 1234-5678</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-blue-300">📍</span>
                  <span className="text-gray-300">Av. Corrientes 1234, CABA</span>
                </li>
              </ul>
            </div>
            
            {/* Columna 2: Enlaces rápidos */}
            <div>
              <h3 className="text-lg font-bold text-green-400 mb-4">Enlaces Rápidos</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-300 hover:text-white transition-colors">Sobre Nosotros</Link></li>
                <li><Link href="/new-arrivals" className="text-gray-300 hover:text-white transition-colors">Nuevos Productos</Link></li>
                <li><Link href="/sale" className="text-gray-300 hover:text-white transition-colors">Ofertas Especiales</Link></li>
              </ul>
            </div>
            
            {/* Columna 3: Soporte al Cliente */}
            <div>
              <h3 className="text-lg font-bold text-purple-400 mb-4">Soporte al Cliente</h3>
              <ul className="space-y-2">
                <li><Link href="/help-center" className="text-gray-300 hover:text-white transition-colors">Centro de Ayuda</Link></li>
                <li><Link href="/size-guide" className="text-gray-300 hover:text-white transition-colors">Guía de Tallas</Link></li>
                <li><Link href="/how-to-buy" className="text-gray-300 hover:text-white transition-colors">Cómo Comprar</Link></li>
                <li><Link href="/contact-support" className="text-gray-300 hover:text-white transition-colors">Contactar Soporte</Link></li>
              </ul>
            </div>
            
            {/* Columna 4: Legal */}
            <div>
              <h3 className="text-lg font-bold text-yellow-400 mb-4">Información Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">Política de Privacidad</Link></li>
                <li><Link href="/terms" className="text-gray-300 hover:text-white transition-colors">Términos y Condiciones</Link></li>
                <li><Link href="/shipping" className="text-gray-300 hover:text-white transition-colors">Envíos y Devoluciones</Link></li>
                <li><Link href="/faq" className="text-gray-300 hover:text-white transition-colors">Preguntas Frecuentes</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Redes sociales y copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-6 mb-4 md:mb-0">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <FaFacebook className="text-2xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                <FaTwitter className="text-2xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">
                <FaInstagram className="text-2xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                <FaLinkedin className="text-2xl" />
              </a>
            </div>
            <p className="text-gray-400 text-sm">
              © {currentYear} E-commerce Template. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
