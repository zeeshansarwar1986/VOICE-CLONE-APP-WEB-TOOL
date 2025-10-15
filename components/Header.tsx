import React from 'react';
import type { Language } from '../types';

interface HeaderProps {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const Header: React.FC<HeaderProps> = ({ language, setLanguage }) => {
  const isRtl = language !== 'en';

  const titles = {
    en: 'Sarwar Voice Studio',
    ur: 'سرور وائس اسٹوڈیو',
    ar: 'استوديو صوت سروار',
  };

  const commonButtonClasses = "px-4 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-200 focus:ring-indigo-500";
  const activeButtonClasses = "bg-indigo-600 text-white";
  const inactiveButtonClasses = "bg-white text-slate-700 hover:bg-slate-100";
  
  return (
    <header className="flex flex-col sm:flex-row items-center justify-between">
      <h1 className={`text-3xl sm:text-4xl font-bold text-slate-900 ${isRtl ? 'font-urdu' : 'font-sans'}`}>
        {titles[language]}
      </h1>
      <div className="mt-4 sm:mt-0 flex items-center bg-slate-200 rounded-lg p-1 space-x-1 rtl:space-x-reverse">
        <button
          onClick={() => setLanguage('en')}
          className={`${commonButtonClasses} ${language === 'en' ? activeButtonClasses : inactiveButtonClasses}`}
        >
          English
        </button>
        <button
          onClick={() => setLanguage('ur')}
          className={`${commonButtonClasses} ${language === 'ur' ? activeButtonClasses : inactiveButtonClasses} font-urdu`}
        >
          اردو
        </button>
        <button
          onClick={() => setLanguage('ar')}
          className={`${commonButtonClasses} ${language === 'ar' ? activeButtonClasses : inactiveButtonClasses} font-urdu`}
        >
          العربية
        </button>
      </div>
    </header>
  );
};

export default Header;