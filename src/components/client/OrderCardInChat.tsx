import React, { useState } from 'react';
import { OrderItem } from '../../types';
import { ShoppingBag, CheckCircle2, Edit2, AlertCircle } from 'lucide-react';
import { ConfirmModal } from '../common/ConfirmModal';

interface OrderCardInChatProps {
  messageId: string;
  items: OrderItem[];
  totalAmount: number;
  deliveryAddress?: string;
  confirmed?: boolean;
  language?: 'en' | 'ur' | 'ps';
  onConfirmOrder: (messageId: string) => void;
  onEditOrder?: () => void;
}

export const OrderCardInChat: React.FC<OrderCardInChatProps> = ({
  messageId,
  items,
  totalAmount,
  deliveryAddress,
  confirmed = false,
  language = 'en',
  onConfirmOrder,
  onEditOrder
}) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirmClick = () => {
    setShowConfirmModal(true);
  };

  const handleExecuteConfirm = async () => {
    setIsConfirming(true);
    try {
      await onConfirmOrder(messageId);
    } finally {
      setIsConfirming(false);
      setShowConfirmModal(false);
    }
  };

  const labels = {
    en: { title: 'Order Summary', confirm: 'Confirm Order', edit: 'Edit / Modify', confirmed: 'Order Confirmed', total: 'Total Amount' },
    ur: { title: 'آرڈر کی تفصیلات', confirm: 'آرڈر کی تصدیق کریں', edit: 'تبدیلی کریں', confirmed: 'آرڈر کی تصدیق ہو گئی', total: 'کل رقم' },
    ps: { title: 'د آرډر خلاصه', confirm: 'آرډر تایید کړئ', edit: 'تغییر ورکړئ', confirmed: 'آرډر تایید شو', total: 'ټوله مجموعه' }
  };

  const t = labels[language] || labels.en;

  return (
    <div className="my-2 max-w-sm w-full bg-slate-900 border border-slate-700/80 rounded-2xl p-4 shadow-xl text-slate-100">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-white uppercase tracking-wider">{t.title}</span>
        </div>
        {confirmed ? (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-800/60">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {t.confirmed}
          </span>
        ) : (
          <span className="text-xs font-semibold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded-lg border border-amber-800/60">
            Pending Confirmation
          </span>
        )}
      </div>

      {/* Items List */}
      <div className="py-3 space-y-2 border-b border-slate-800">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs">
            <div>
              <p className="font-semibold text-slate-200">{item.productName}</p>
              <p className="text-[11px] text-slate-400">
                {item.quantity} x PKR {item.unitPrice.toLocaleString()} / {item.unit}
              </p>
            </div>
            <p className="font-mono font-bold text-slate-100">
              PKR {item.totalPrice.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Total Amount */}
      <div className="pt-3 pb-2 flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400">{t.total}:</span>
        <span className="text-base font-mono font-extrabold text-emerald-400">
          PKR {totalAmount.toLocaleString()}
        </span>
      </div>

      {deliveryAddress && (
        <p className="text-[11px] text-slate-400 mb-3 truncate">
          📍 Deliver to: <span className="text-slate-300 font-medium">{deliveryAddress}</span>
        </p>
      )}

      {/* Action Buttons */}
      {!confirmed && (
        <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-800/80">
          {onEditOrder && (
            <button
              onClick={onEditOrder}
              className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>{t.edit}</span>
            </button>
          )}
          <button
            onClick={handleConfirmClick}
            className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{t.confirm}</span>
          </button>
        </div>
      )}

      {/* Confirmation Modal for placing order */}
      <ConfirmModal
        isOpen={showConfirmModal}
        title="Confirm Wholesale Order"
        description="Are you sure you want to finalize and place this wholesale order?"
        highlightText={`Total Order Amount: PKR ${totalAmount.toLocaleString()}`}
        confirmLabel="Yes, Place Order"
        variant="primary"
        isLoading={isConfirming}
        onConfirm={handleExecuteConfirm}
        onCancel={() => setShowConfirmModal(false)}
      />
    </div>
  );
};
