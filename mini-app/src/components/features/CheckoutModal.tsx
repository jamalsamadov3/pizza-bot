import { useState } from 'react';
import { useTelegram } from '@/hooks/useTelegram';
import { useCartStore } from '@/store/cartStore';
import { createOrder } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { CartList } from './CartList';
import { ChevronDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { user, onClose: closeTelegramApp, webApp } = useTelegram();
  const { items, getTotalPrice, clearCart } = useCartStore();
  
  const [name, setName] = useState(user?.first_name || '');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || (!phone && !user?.id) || !address) {
      setError("Barcha maydonlarni to'ldiring");
      // Vibrate on error
      webApp?.HapticFeedback.notificationOccurred('error');
      return;
    }

    if (items.length === 0) {
      setError("Savatda mahsulot yo'q");
      return;
    }

    setLoading(true);
    setError('');

    try {
      await createOrder({
        telegramId: user?.id?.toString() || '123456789', // Fallback for local testing
        name,
        phone,
        address,
        items: items.map(item => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: getTotalPrice()
      });
      
      // Success Haptic Feedback
      webApp?.HapticFeedback.notificationOccurred('success');
      
      clearCart();
      
      // Allow user to see the success state for a moment before closing
      if (webApp) {
         webApp.showAlert("Buyurtmangiz muvaffaqiyatli qabul qilindi!", () => {
             closeTelegramApp();
         });
      } else {
         alert("Buyurtmangiz muvaffaqiyatli qabul qilindi!");
         onClose();
      }

    } catch (err) {
      setError("Xatolik yuz berdi. Iltimos qayta urinib ko'ring.");
      webApp?.HapticFeedback.notificationOccurred('error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div 
        className={cn(
          "fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />
      <div 
        className={cn(
          "fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-[70] shadow-2xl transition-transform duration-300 ease-out flex flex-col max-h-[90vh]",
          isOpen ? "translate-y-0" : "translate-y-full pointer-events-none"
        )}
      >
        <div className="w-full flex justify-center pt-3 pb-1" onClick={onClose} role="button">
          <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
        </div>
        
        <div className="px-5 pb-5 pt-2 flex items-center justify-between border-b border-slate-100 shrink-0">
          <h2 className="text-xl font-bold text-slate-800">Rasmiylashtirish</h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
          >
            <ChevronDown size={20} />
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-4 pb-[120px]">
          <CartList />

          <form id="checkout-form" onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <h3 className="font-semibold text-slate-800 border-b border-slate-100 pb-2">Yetkazib berish ma'lumotlari</h3>
            
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100 font-medium tracking-wide">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="name" className="text-sm font-medium text-slate-700 ml-1">Ism va Familiya <span className="text-red-500">*</span></label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masalan: Sardor To'rayev"
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="phone" className="text-sm font-medium text-slate-700 ml-1">Telefon raqam <span className="text-red-500">*</span></label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+998 90 123 45 67"
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="address" className="text-sm font-medium text-slate-700 ml-1">Manzil <span className="text-red-500">*</span></label>
              <textarea
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Toshkent shahar, Yunusobod tumani, ..."
                rows={3}
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all resize-none"
                required
              />
            </div>
          </form>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-5 bg-white border-t border-slate-100 pb-safe shadow-[0_-10px_20px_rgba(0,0,0,0.03)]">
          <Button 
            type="submit" 
            form="checkout-form" 
            className="w-full h-14 text-base font-semibold shadow-md shadow-orange-500/20"
            disabled={loading || items.length === 0}
          >
            {loading ? (
              <span className="flex items-center gap-2"><Loader2 className="animate-spin" size={20} /> Iltimos kuting...</span>
            ) : (
              "Buyurtmani tasdiqlash"
            )}
          </Button>
        </div>
      </div>
    </>
  );
}
