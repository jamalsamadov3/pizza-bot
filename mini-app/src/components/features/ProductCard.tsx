import { Product, useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';
import { Plus, Minus } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const cartItems = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const cartItem = cartItems.find((item) => item.id === product.id);
  const quantity = cartItem?.quantity || 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col sm:flex-row">
      <div className="h-48 sm:h-auto sm:w-48 bg-slate-50 relative shrink-0">
        {/* Using standard img instead of Next Image since these might be external URLs in our seed data */}
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-4 flex flex-col flex-1 h-full min-h-[140px]">
        <h3 className="font-semibold text-lg text-slate-800">{product.name}</h3>
        <p className="text-sm text-slate-500 line-clamp-2 mt-1 mb-4 flex-1">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-50">
          <span className="font-semibold text-orange-600">
            {formatPrice(product.price)}
          </span>
          
          {quantity > 0 ? (
            <div className="flex items-center gap-3 bg-orange-50 rounded-xl p-1 px-2 border border-orange-100">
              <button 
                onClick={() => quantity > 1 ? updateQuantity(product.id, quantity - 1) : removeItem(product.id)}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow-sm text-orange-600 active:scale-95 transition-transform"
              >
                <Minus size={16} strokeWidth={2.5} />
              </button>
              <span className="font-medium w-4 text-center">{quantity}</span>
              <button 
                onClick={() => addItem(product)}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-orange-600 text-white shadow-sm active:scale-95 transition-transform"
              >
                <Plus size={16} strokeWidth={2.5} />
              </button>
            </div>
          ) : (
            <Button 
              onClick={() => addItem(product)} 
              size="sm"
              className="rounded-xl px-4 font-medium"
            >
              Qo'shish
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
