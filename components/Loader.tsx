import React from 'react';
import type { Language } from '../types';

interface LoaderProps {
  language: Language;
}

const translations = {
    en: {
        magic: 'Working our magic...',
        wait: 'Please wait while we generate the perfect audio for you.',
    },
    ur: {
        magic: 'جادو ہو رہا ہے...',
        wait: 'براہ کرم انتظار کریں جب ہم آپ کے لیے بہترین آڈیو تیار کر رہے ہیں۔',
    },
    ar: {
        magic: 'نقوم بسحرنا...',
        wait: 'يرجى الانتظار بينما نقوم بإنشاء الصوت المثالي لك.',
    }
};

const Loader: React.FC<LoaderProps> = ({ language }) => {
  const t = translations[language];
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-indigo-500"></div>
      <p className="text-lg font-semibold text-slate-700">
        {t.magic}
      </p>
      <p className="text-sm text-slate-500 text-center max-w-xs">
        {t.wait}
      </p>
    </div>
  );
};

export default Loader;