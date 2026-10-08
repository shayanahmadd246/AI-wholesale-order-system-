import React from 'react';
import { MessageSquare, Package, CreditCard, RotateCcw } from 'lucide-react';

export type ClientTab = 'chat' | 'orders' | 'account' | 'reorder';

interface ClientBottomNavProps {
  activeTab: ClientTab;
  setActiveTab: (tab: ClientTab) => void;
  language?: 'en' | 'ur' | 'ps';
}

export const ClientBottomNav: React.FC<ClientBottomNavProps> = ({
  activeTab,
  setActiveTab,
  language = 'en'
}) => {
  const tabs = [
    {
      id: 'chat' as ClientTab,
      label: { en: 'AI Chat', ur: 'چیٹ اسسٹنٹ', ps: 'د AI چټ' },
      icon: MessageSquare
    },
    {
      id: 'orders' as ClientTab,
      label: { en: 'My Orders', ur: 'میرے آرڈرز', ps: 'زما آرډرونه' },
      icon: Package
    },
    {
      id: 'account' as ClientTab,
      label: { en: 'My Account', ur: 'کھاتہ / حساب', ps: 'زما حساب' },
      icon: CreditCard
    },
    {
      id: 'reorder' as ClientTab,
      label: { en: 'Reorder', ur: 'دوبارہ آرڈر', ps: 'بیا آرډر' },
      icon: RotateCcw
    }
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-[#121212] border-t border-[#262422] text-[#A39E93] pb-safe">
      <div className="max-w-md mx-auto grid grid-cols-4 h-16">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const labelText = tab.label[language] || tab.label.en;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 transition-colors relative ${
                isActive ? 'text-[#C5A059] font-bold' : 'text-[#A39E93] hover:text-[#FAF7F2] font-medium'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'scale-110 text-[#C5A059]' : ''} transition-transform`} />
              <span className="text-[11px] truncate max-w-[80px]">{labelText}</span>
              {isActive && (
                <span className="absolute top-0 inset-x-4 h-0.5 bg-[#C5A059] rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
