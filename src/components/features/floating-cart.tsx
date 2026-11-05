'use client';

import { useCart } from '@/contexts/CartContext';
import { useFeedbackModal } from '@/contexts/FeedbackModalContext';
import { ShoppingBag } from 'lucide-react';

export default function FloatingCart() {
  const { cart, getTotalItems } = useCart();
  const { openModal } = useFeedbackModal();
  const totalItems = getTotalItems();

  if (cart.length === 0) {
    return null;
  }

  const handleCartClick = () => {
    openModal({
      scope: 'cart_checkout' as any,
      title: 'Оформление заказа',
      subtitle: 'Проверьте ваш заказ и заполните контактные данные',
    });
  };

  return (
    <button
      onClick={handleCartClick}
      className="fixed bottom-6 right-6 z-40 bg-[#E65F2B] text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:bg-[#d5541e] transition-all hover:scale-105 active:scale-95"
      aria-label="Открыть корзину"
    >
      <ShoppingBag className="w-7 h-7" />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-white text-[#E65F2B] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-md">
          {totalItems}
        </span>
      )}
    </button>
  );
}
