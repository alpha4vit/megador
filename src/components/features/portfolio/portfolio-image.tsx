'use client';

import {useState, ImgHTMLAttributes} from 'react';
import type {ProjectSection} from './portfolio-data';

const FALLBACK_IMAGES: Record<ProjectSection, string> = {
    swing: '/swing_fallback.jpeg',
    sliding: '/sliding_fallback.jpeg',
    sectional: '/sectional_fallback.jpeg',
    'roller-gates': '/sectional_fallback.jpeg',
    barriers: '/barrier_fallback.jpeg',
};

interface PortfolioImageFallbackProps {
    section: ProjectSection;
    className?: string;
}

export function PortfolioImageFallback({section, className = ''}: PortfolioImageFallbackProps) {
    return (
        <div
            className={`w-full h-full flex items-center justify-center bg-zinc-100 ${className}`}
            role="img"
            aria-label="Изображение проекта отсутствует"
        >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={FALLBACK_IMAGES[section]}
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
    section: ProjectSection;
    fallbackClassName?: string;
}

export function PortfolioImage({src, alt, section, fallbackClassName, className = '', ...rest}: PortfolioImageProps) {
    const [failed, setFailed] = useState(false);

    if (!src || failed) {
        return <PortfolioImageFallback section={section} className={fallbackClassName}/>;
    }

    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={src}
            alt={alt}
            draggable={false}
            loading="lazy"
            onError={() => setFailed(true)}
            className={className}
            {...rest}
        />
    );
}
