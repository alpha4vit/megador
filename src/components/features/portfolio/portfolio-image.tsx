'use client';

import {useState, ImgHTMLAttributes} from 'react';
import type {PortfolioGateType} from './portfolio-data';

const FALLBACK_IMAGES: Record<PortfolioGateType, string> = {
    SWING: '/swing_fallback.jpeg',
    SLIDING: '/sliding_fallback.jpeg',
    SECTIONAL: '/sectional_fallback.jpeg',
    ROLLER: '/sectional_fallback.jpeg',
    BARRIER: '/barrier_fallback.jpeg',
};

interface PortfolioImageFallbackProps {
    type: PortfolioGateType;
    className?: string;
}

export function PortfolioImageFallback({type, className = ''}: PortfolioImageFallbackProps) {
    return (
        <div
            className={`w-full h-full flex items-center justify-center bg-zinc-100 ${className}`}
            role="img"
            aria-label="Изображение проекта отсутствует"
        >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={FALLBACK_IMAGES[type]}
                alt=""
                draggable={false}
                className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
            />
        </div>
    );
}

interface PortfolioImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> {
    src: string;
    alt: string;
    type: PortfolioGateType;
    fallbackClassName?: string;
}

export function PortfolioImage({src, alt, type, fallbackClassName, className = '', ...rest}: PortfolioImageProps) {
    const [failed, setFailed] = useState(false);

    if (!src || failed) {
        return <PortfolioImageFallback type={type} className={fallbackClassName}/>;
    }

    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={src}
            alt={alt}
            draggable={false}
            onError={() => setFailed(true)}
            className={className}
            {...rest}
        />
    );
}
