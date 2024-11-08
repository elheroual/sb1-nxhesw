import React from 'react';
import { useLanguage } from '../lib/contexts/LanguageContext';
import { Languages } from 'lucide-react';

export const LanguageToggle: React.FC = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
    >
      <Languages className="h-4 w-4 mr-1.5" />
      {language === 'fr' ? 'EN' : 'FR'}
    </button>
  );
};