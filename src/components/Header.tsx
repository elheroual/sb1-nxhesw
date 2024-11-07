import React from 'react';
import { ClipboardList, Menu, X } from 'lucide-react';

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
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-effect">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4 animate-slide-in">
            <div className="flex items-center">
              <ClipboardList className="h-8 w-8 text-blue-600 animate-float" />
              <h1 className="ml-3 text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {title}
              </h1>
            </div>
          </div>

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
        </div>
      </div>
    </header>
  );
};