'use client';

import type {SVGProps} from 'react';

export type BarrierIllustrationMode = 'not-found' | 'server-error';

interface BarrierIllustrationProps extends SVGProps<SVGSVGElement> {
    /** Error code rendered on the hanging sign plate, e.g. "404", "500", "502". */
    code: string;
    /** 'server-error' adds a blinking beacon and pointer cursor for retry. */
    mode?: BarrierIllustrationMode;
    /** Called when the illustration is clicked (server-error mode). */
    onActivate?: () => void;
}

/**
 * Custom vector illustration of an automatic barrier arm.
 * The boom carries a hanging sign plate showing the HTTP/status code.
 */
export function BarrierIllustration({code, mode = 'not-found', onActivate, className, ...rest}: BarrierIllustrationProps) {
    const interactive = mode === 'server-error' && Boolean(onActivate);
    const beaconClass = mode === 'server-error' ? 'animate-pulse' : '';

    const svg = (
        <svg
            viewBox="0 0 420 260"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            role={interactive ? 'button' : 'img'}
            aria-label={interactive ? 'Повторить попытку' : `Иллюстрация шлагбаума, код ${code}`}
            {...rest}
        >
            <defs>
                <pattern id="boom-stripes" width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(24)">
                    <rect width="18" height="18" fill="#F8F9FA"/>
                    <rect width="9" height="18" fill="#E65F2B"/>
                </pattern>
                <linearGradient id="post-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#334155"/>
                    <stop offset="100%" stopColor="#1E293B"/>
                </linearGradient>
            </defs>

            {/* Ground */}
            <line x1="16" y1="222" x2="404" y2="222" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round"/>
            <line x1="16" y1="228" x2="120" y2="228" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round"/>
            <line x1="300" y1="228" x2="404" y2="228" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round"/>

            {/* Pedestal post */}
            <rect x="34" y="96" width="38" height="118" rx="7" fill="url(#post-grad)"/>
            <rect x="26" y="208" width="54" height="14" rx="5" fill="#1E293B"/>
            <rect x="40" y="104" width="4" height="100" rx="2" fill="#475569" opacity="0.6"/>

            {/* Beacon */}
            <rect x="46" y="82" width="14" height="15" rx="4" fill="#1E293B"/>
            <circle cx="53" cy="73" r="8" fill="#E65F2B" className={beaconClass}/>
            <circle cx="53" cy="73" r="3.5" fill="#FCA5A5"/>

            {/* Boom arm (raised, striped) */}
            <g transform="rotate(-7 210 92)">
                <rect x="58" y="80" width="310" height="15" rx="4" fill="url(#boom-stripes)" stroke="#1E293B" strokeWidth="1.5"/>
                <rect x="58" y="86.5" width="310" height="2" fill="#1E293B" opacity="0.25"/>
            </g>
            {/* Pivot joint */}
            <circle cx="60" cy="95" r="10" fill="#1E293B"/>
            <circle cx="60" cy="95" r="4" fill="#E65F2B"/>

            {/* Hanging sign bracket + plate */}
            <line x1="292" y1="80" x2="292" y2="106" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round"/>
            <rect x="256" y="106" width="72" height="46" rx="9" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2"/>
            <rect x="256" y="106" width="72" height="10" rx="5" fill="#E65F2B"/>
            <text
                x="292"
                y="143"
                textAnchor="middle"
                fontFamily="var(--font-montserrat), system-ui, sans-serif"
                fontWeight="800"
                fontSize="22"
                fill="#1E293B"
                letterSpacing="1"
            >
                {code}
            </text>

            {/* Small caution stripes on pedestal base */}
            <path d="M30 216l8-8M38 216l8-8M46 216l8-8" stroke="#E65F2B" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
        </svg>
    );

    if (interactive) {
        return (
            <button
                type="button"
                onClick={onActivate}
                className="cursor-pointer block w-full h-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E65F2B] focus-visible:ring-offset-4 rounded-2xl"
                title="Нажмите, чтобы повторить"
            >
                {svg}
            </button>
        );
    }

    return svg;
}
