import React from 'react';
import { ClipboardList, Menu, X } from 'lucide-react';
import { useLanguage } from '../lib/contexts/LanguageContext';
import { LanguageToggle } from './LanguageToggle';

interface HeaderProps {
  title?: string;
  onMenuClick?: () => void;
  isMenuOpen?: boolean;
  children?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ 
  title = "Elheroual Tickets Management APP",
  onMenuClick,
  isMenuOpen,
  children
}) => {
  const { t } = useLanguage();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-effect">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            {onMenuClick && (
              <button
                onClick={onMenuClick}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 md:hidden"
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5 animate-scale-in" />
                ) : (
                  <Menu className="h-5 w-5 animate-scale-in" />
                )}
              </button>
            )}

            {/* Logo and title */}
            <div className="flex items-center space-x-3 animate-slide-in">
              <ClipboardList className="h-6 w-6 text-blue-600 animate-float" />
              <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t('tickets.management')}
              </h1>
            </div>
          </div>

          {/* Center section for notifications */}
          <div className="flex-1 flex justify-center">
            {children}
          </div>

          {/* Right section for language toggle */}
          <div className="flex items-center justify-end w-32">
            <LanguageToggle />
          </div>
        </div>
      </div>
    </header>
  );
};