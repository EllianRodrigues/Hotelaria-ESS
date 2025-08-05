import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Home, Search, User, Menu, X } from 'lucide-react';
import { FavoritosProvider } from '../../context/FavoritosContext';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Início', href: '/', icon: Home },
    { name: 'Anúncios', href: '/anuncios', icon: Search },
    { name: 'Favoritos', href: '/favoritos', icon: Heart },
    { name: 'Perfil', href: '/perfil', icon: User },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <FavoritosProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div className="flex items-center">
                <Link to="/" className="flex items-center space-x-2">
                  <Heart className="w-8 h-8 text-red-500" />
                  <span className="text-xl font-bold text-gray-900">Hotelaria</span>
                </Link>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex space-x-8">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive(item.href)
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                >
                  {sidebarOpen ? (
                    <X className="w-6 h-6" />
                  ) : (
                    <Menu className="w-6 h-6" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Navigation */}
        {sidebarOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-b border-gray-200">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActive(item.href)
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-auto">
          <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Heart className="w-6 h-6 text-red-500" />
                  <span className="text-lg font-bold text-gray-900">Hotelaria</span>
                </div>
                <p className="text-gray-600 text-sm">
                  Encontre os melhores hotéis e acomodações para suas viagens.
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Links Úteis</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><Link to="/anuncios" className="hover:text-gray-900">Anúncios</Link></li>
                  <li><Link to="/favoritos" className="hover:text-gray-900">Favoritos</Link></li>
                  <li><Link to="/perfil" className="hover:text-gray-900">Perfil</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Suporte</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><a href="#" className="hover:text-gray-900">Central de Ajuda</a></li>
                  <li><a href="#" className="hover:text-gray-900">Contato</a></li>
                  <li><a href="#" className="hover:text-gray-900">Política de Privacidade</a></li>
                </ul>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-center text-sm text-gray-600">
                © 2024 Hotelaria. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </FavoritosProvider>
  );
};

export default Layout; 