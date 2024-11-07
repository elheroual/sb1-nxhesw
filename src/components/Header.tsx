import React from 'react';
import { ClipboardList, Menu, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageToggle } from './LanguageToggle';

interface HeaderProps {
  title?: string;
  onMenuClick?: () => void;
  isMenuOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  title = "Elheroual Tickets Management APP",
  onMenuClick,
  isMenuOpen
}) => {
  const { t } = useLanguage();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-effect">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu button */}
          {onMenuClick && (
            <button
              onClick={onMenuClick}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 md:hidden"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 animate-scale-in" />
              ) : (
                <Menu className="h-6 w-6 animate-scale-in" />
              )}
            </button>
          )}

          {/* Centered logo and title */}
          <div className="flex-1 flex items-center justify-center">
            <div className="flex items-center space-x-4 animate-slide-in">
              <ClipboardList className="h-8 w-8 text-blue-600 animate-float" />
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t('tickets.management')}
              </h1>
            </div>
          </div>

          {/* Language toggle */}
          <div className="flex items-center">
            <LanguageToggle />
          </div>

          {/* Empty div to maintain centering when menu button is present */}
          {onMenuClick && <div className="w-10 md:hidden" />}
        </div>
      </div>
    </header>
  );
};