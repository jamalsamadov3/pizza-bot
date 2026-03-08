import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export function CartList() {
  const { items, updateQuantity, removeItem, clearCart, getTotalPrice } = useCartStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-3xl">🛒</span>
        </div>
        <h3 className="text-lg font-medium text-slate-800 mb-1">Savat bo'sh</h3>
        <p className="text-slate-500 text-sm max-w-[200px]">
          Pizza tanlash uchun menyuga o'ting va savatga qo'shing
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-slate-800">Sizning buyurtmalaringiz</h3>
        <button 
          onClick={clearCart}
          className="text-sm text-red-500 hover:bg-red-50 px-2 py-1 rounded-md transition-colors flex items-center gap-1"
        >
          <Trash2 size={14} /> Tozalash
        </button>
      </div>

      <div className="space-y-3 pb-4 border-b border-slate-100">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl">
            <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-white">
              <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-slate-800 text-sm truncate">{item.name}</h4>
              <p className="font-semibold text-orange-600 text-sm mt-1">{formatPrice(item.price)}</p>
            </div>

            <div className="flex items-center gap-2 bg-white rounded-lg p-1 border border-slate-100 shadow-sm">
              <button 
                onClick={() => items.length === 1 && item.quantity === 1 ? clearCart() : updateQuantity(item.id, item.quantity - 1)}
                className="w-7 h-7 flex items-center justify-center rounded-md active:bg-slate-100 text-slate-600"
              >
                <Minus size={14} />
              </button>
              <span className="w-4 text-center text-sm font-medium">{item.quantity}</span>
              <button 
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="w-7 h-7 flex items-center justify-center rounded-md active:bg-slate-100 text-slate-600"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between font-semibold text-lg text-slate-800 pt-2 pb-1">
        <span>Jami summa:</span>
        <span>{formatPrice(getTotalPrice())}</span>
      </div>
    </div>
  );
}
