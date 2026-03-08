'use client';

import { useEffect, useState } from 'react';
import { getProducts } from '@/lib/api';
import { Product, useCartStore } from '@/store/cartStore';
import { ProductCard } from '@/components/features/ProductCard';
import { CheckoutModal } from '@/components/features/CheckoutModal';
import { Button } from '@/components/ui/Button';
import { useTelegramContext } from '@/providers/TelegramProvider';
import { ShoppingBag, Loader2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { useTelegram } from '@/hooks/useTelegram';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const { isReady } = useTelegramContext();
  const { webApp } = useTelegram();
  const totalItems = useCartStore((state) => state.getTotalItems());
  const totalPrice = useCartStore((state) => state.getTotalPrice());
  const [isClient, setIsClient] = useState(false);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err: any) {
        console.error('Failed to fetch products:', err);
        setError(err?.message || 'Failed to load products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (!isReady || isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-[80vh] items-center justify-center p-6 text-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-4 w-full">
          <p className="font-bold mb-1">Xatolik yuz berdi!</p>
          <p className="text-sm break-words">{error}</p>
        </div>
        <Button onClick={() => window.location.reload()}>Qayta urinish</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="bg-white px-5 py-4 shadow-sm sticky top-0 z-40">
        <h1 className="text-2xl font-bold font-sans tracking-tight text-slate-800">
          Pizza Menu 🍕
        </h1>
        <p className="text-sm text-slate-500 mt-1 font-medium">
          Eng mazali pizzalarni tanlang
        </p>
      </header>

      <div className="p-5 pb-32 flex flex-col gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {isClient && totalItems > 0 && (
        <div className="fixed bottom-24 left-0 right-0 px-5 z-40 transition-all duration-300 animate-in slide-in-from-bottom-5">
          <Button 
            onClick={() => {
              setIsCheckoutOpen(true);
              webApp?.HapticFeedback.impactOccurred('light');
            }}
            size="lg" 
            className="w-full shadow-[0_8px_30px_rgb(234,88,12,0.3)] flex items-center justify-between px-6"
          >
            <div className="flex items-center gap-3 bg-orange-700/50 py-1.5 px-3 rounded-lg">
              <ShoppingBag size={20} className="text-white shrink-0" />
              <div className="text-left leading-tight">
                <div className="text-[11px] text-orange-100 font-medium">{totalItems} ta mahsulot</div>
                <div className="font-bold text-white tracking-wide">{formatPrice(totalPrice)}</div>
              </div>
            </div>
            
            <span className="font-semibold text-[15px]">Buyurtma berish</span>
          </Button>
        </div>
      )}

      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
      />
    </div>
  );
}
