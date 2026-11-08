'use client';

import {useEffect} from 'react';

const IMAGE_SELECTOR = 'img';

export function ImageProtectionGuard() {
    useEffect(() => {
        const protectImage = (image: HTMLImageElement) => {
            image.draggable = false;

            const parent = image.parentElement;
            if (!parent || parent === document.body || parent.dataset.imageProtected === 'true') {
                return;
            }

            if (getComputedStyle(parent).position === 'static') {
                parent.style.position = 'relative';
            }

            parent.classList.add('select-none');

            const overlay = document.createElement('div');
            overlay.setAttribute('aria-hidden', 'true');
            overlay.className = 'absolute inset-0 z-10 bg-transparent';
            parent.dataset.imageProtected = 'true';
            parent.appendChild(overlay);
        };

        const scan = () => {
            document.querySelectorAll<HTMLImageElement>(IMAGE_SELECTOR).forEach((image) => {
                if (!image.closest('[data-image-guard-exclude]')) {
                    protectImage(image);
                }
            });
        };

        const handleContextMenu = (event: MouseEvent) => {
            const target = event.target;
            if (target instanceof HTMLImageElement || target instanceof HTMLPictureElement) {
                event.preventDefault();
                return;
            }

            const image = target instanceof Element ? target.closest('img, picture') : null;
            if (image && !image.closest('[data-image-guard-exclude]')) {
                event.preventDefault();
            }
        };

        scan();

        const observer = new MutationObserver((mutations) => {
            const hasImageChanges = mutations.some((mutation) => {
                if (mutation.type === 'childList') {
                    return Array.from(mutation.addedNodes).some((node) =>
                        node instanceof HTMLImageElement || node instanceof HTMLPictureElement ||
                        (node instanceof HTMLElement && Boolean(node.querySelector(IMAGE_SELECTOR)))
                    );
                }

                return mutation.type === 'attributes' && mutation.attributeName === 'src';
            });

            if (hasImageChanges) {
                scan();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['src'],
        });

        const handleDragStart = (event: DragEvent) => {
            if (event.target instanceof HTMLImageElement || event.target instanceof HTMLPictureElement) {
                event.preventDefault();
            }
        };

        document.addEventListener('contextmenu', handleContextMenu, true);
        document.addEventListener('dragstart', handleDragStart, true);

        return () => {
            observer.disconnect();
            document.removeEventListener('contextmenu', handleContextMenu, true);
            document.removeEventListener('dragstart', handleDragStart, true);
        };
    }, []);

    return null;
}
