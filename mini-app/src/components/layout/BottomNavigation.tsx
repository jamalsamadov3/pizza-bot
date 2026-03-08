'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ReceiptText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTelegram } from '@/hooks/useTelegram';
import { useEffect } from 'react';

export function BottomNavigation() {
  const pathname = usePathname();
  const { webApp } = useTelegram();

  // Handle Telegram theme colors
  const bgColor = webApp?.backgroundColor || '#ffffff';
  
  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl shadow-[0_-4px_24px_rgba(0,0,0,0.06)] border-t border-slate-100 px-6 py-2 pb-safe flex justify-around items-center bg-white backdrop-blur-md bg-opacity-95"
      style={{
        paddingBottom: 'calc(env(safe-area-inset-bottom) + 8px)'
      }}
    >
      <Link 
        href="/"
        className={cn(
          "flex flex-col items-center gap-1.5 p-2 px-4 rounded-xl transition-all duration-200 active:scale-95",
          pathname === '/' 
            ? "text-orange-600 bg-orange-50" 
            : "text-slate-400 hover:text-slate-600"
        )}
      >
        <div className="relative">
          <Home size={22} strokeWidth={pathname === '/' ? 2.5 : 2} />
        </div>
        <span className="text-[11px] font-semibold tracking-wide">Bosh sahifa</span>
      </Link>

      <Link 
        href="/orders"
        className={cn(
          "flex flex-col items-center gap-1.5 p-2 px-4 rounded-xl transition-all duration-200 active:scale-95",
          pathname === '/orders' 
            ? "text-orange-600 bg-orange-50" 
            : "text-slate-400 hover:text-slate-600"
        )}
      >
        <ReceiptText size={22} strokeWidth={pathname === '/orders' ? 2.5 : 2} />
        <span className="text-[11px] font-semibold tracking-wide">Buyurtmalar</span>
      </Link>
    </div>
  );
}
