'use client';

import { useEffect, useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useFeedbackModal } from '@/contexts/FeedbackModalContext';
import { ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FloatingCart() {
  const { cart, getTotalItems } = useCart();
  const { openModal } = useFeedbackModal();
  const totalItems = getTotalItems();
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const onArrived = () => setPulse((p) => p + 1);
    window.addEventListener('megador:cart-arrived', onArrived);
    return () => window.removeEventListener('megador:cart-arrived', onArrived);
  }, []);

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
      data-cart-fab
      onClick={handleCartClick}
      className="fixed bottom-6 right-6 z-40 bg-[#E65F2B] text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:bg-[#d5541e] transition-all hover:scale-105 active:scale-95"
      aria-label="Открыть корзину"
    >
      <motion.div
        key={pulse}
        className="flex items-center justify-center"
        initial={{ scale: 1 }}
        animate={pulse > 0 ? { scale: [1, 1.35, 1] } : { scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <ShoppingBag className="w-7 h-7" />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-white text-[#E65F2B] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-md">
            {totalItems}
          </span>
        )}
      </motion.div>
    </button>
  );
}
