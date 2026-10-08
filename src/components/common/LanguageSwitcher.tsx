import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Language } from '../../types';
import { Languages } from 'lucide-react';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useAuth();

  const options: { code: Language; label: string; nativeName: string }[] = [
    { code: 'en', label: 'English', nativeName: 'English' },
    { code: 'ur', label: 'Urdu', nativeName: 'اردو' },
    { code: 'ps', label: 'Pashto', nativeName: 'پښتو' }
  ];

  return (
    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
      <div className="px-2 text-slate-400">
        <Languages className="w-4 h-4" />
      </div>
      {options.map(opt => {
        const isActive = language === opt.code;
        return (
          <button
            key={opt.code}
            onClick={() => setLanguage(opt.code)}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
              isActive
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
            }`}
          >
            {opt.nativeName}
          </button>
        );
      })}
    </div>
  );
};
