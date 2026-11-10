'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface FlyClone {
    id: number;
    image: string;
    from: { x: number; y: number; w: number; h: number };
    to: { x: number; y: number };
}

interface UseFlyToCartResult {
    clones: FlyClone[];
    /** Call with the source element's bounding rect and image URL. Measures the cart itself. */
    spawnFlyClone: (fromRect: DOMRect, image: string) => void;
    dismissFlyClone: (id: number) => void;
}

export function useFlyToCart(): UseFlyToCartResult {
    const [clones, setClones] = useState<FlyClone[]>([]);
    const cloneIdRef = useRef(0);

    const spawnFlyClone = (fromRect: DOMRect, image: string) => {
        const from = { x: fromRect.left, y: fromRect.top, w: fromRect.width, h: fromRect.height };

        // Wait for the floating cart to mount (it renders only when cart is non-empty)
        // before measuring its position.
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                const cartEl = document.querySelector('[data-cart-fab]');
                const cartRect = cartEl?.getBoundingClientRect();
                if (!cartRect) {
                    window.dispatchEvent(new CustomEvent('megador:cart-arrived'));
                    return;
                }
                const id = ++cloneIdRef.current;
                setClones((prev) => [
                    ...prev,
                    {
                        id,
                        image,
                        from,
                        to: {
                            x: cartRect.left + cartRect.width / 2,
                            y: cartRect.top + cartRect.height / 2,
                        },
                    },
                ]);
            });
        });
    };

    const dismissFlyClone = (id: number) => {
        setClones((prev) => prev.filter((c) => c.id !== id));
    };

    return { clones, spawnFlyClone, dismissFlyClone };
}

export function FlyToCartLayer({ clones, onDismiss }: { clones: FlyClone[]; onDismiss: (id: number) => void }) {
    return (
        <>
            {clones.map((clone) => {
                const dx = clone.to.x - (clone.from.x + clone.from.w / 2);
                const dy = clone.to.y - (clone.from.y + clone.from.h / 2);
                const liftPx = 32;
                const arcHeight = 90;
                // Arc apex: above whichever endpoint is higher, so the path always bulges upward
                const peakY = Math.min(-liftPx, dy) - arcHeight;
                return (
                    <motion.div
                        key={clone.id}
                        className="fixed z-[100] pointer-events-none"
                        style={{
                            left: clone.from.x,
                            top: clone.from.y,
                            width: clone.from.w,
                            height: clone.from.h,
                        }}
                        initial={{ x: 0 }}
                        animate={{ x: [0, 0, dx] }}
                        transition={{
                            duration: 0.95,
                            times: [0, 0.2, 1],
                            ease: ['linear', [0.33, 1, 0.68, 1]],
                        }}
                        onAnimationComplete={() => {
                            window.dispatchEvent(new CustomEvent('megador:cart-arrived'));
                            onDismiss(clone.id);
                        }}
                    >
                        <motion.div
                            className="w-full h-full"
                            initial={{ y: 0, scale: 1, opacity: 1 }}
                            animate={{
                                y: [0, -liftPx, peakY, dy],
                                scale: [1, 1.05, 0.7, 0],
                                opacity: [1, 1, 1, 0],
                            }}
                            transition={{
                                duration: 0.95,
                                times: [0, 0.2, 0.62, 1],
                                ease: [
                                    [0.25, 0.46, 0.45, 0.94],
                                    [0.3, 0, 0.4, 1],
                                    [0.55, 0.06, 0.68, 0.19],
                                ],
                            }}
                        >
                            <img
                                src={clone.image}
                                alt=""
                                className="w-full h-full object-contain mix-blend-multiply bg-white rounded-lg"
                                draggable={false}
                            />
                        </motion.div>
                    </motion.div>
                );
            })}
        </>
    );
}
