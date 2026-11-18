import type {SVGProps} from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const base = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.75,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
} as const;

/** Секционные ворота — portal frame, top track, horizontal panels. */
export function SectionalGateIcon(props: IconProps) {
    return (
        <svg {...base} {...props}>
            <path d="M4 21V10a8 8 0 0 1 16 0v11"/>
            <path d="M2 5h20"/>
            <path d="M7 13h10"/>
            <path d="M7 16.5h10"/>
            <path d="M7 20h10"/>
        </svg>
    );
}

/** Роллетные ворота — opening, top protective box, slatted curtain. */
export function RollerGateIcon(props: IconProps) {
    return (
        <svg {...base} {...props}>
            <path d="M4 21V10a8 8 0 0 1 16 0v11"/>
            <rect x="7" y="3.5" width="10" height="4" rx="1"/>
            <path d="M6.5 13h11"/>
            <path d="M6.5 15.75h11"/>
            <path d="M6.5 18.5h11"/>
        </svg>
    );
}

/** Откатные ворота — panel with pickets, cantilever tail, ground rail. */
export function SlidingGateIcon(props: IconProps) {
    return (
        <svg {...base} {...props}>
            <rect x="3" y="4" width="10" height="15" rx="1.5"/>
            <path d="M5.5 6.5v10"/>
            <path d="M8 6.5v10"/>
            <path d="M10.5 6.5v10"/>
            <path d="M13 19l7-6.5h-7"/>
            <path d="M2 21h20"/>
            <circle cx="6.5" cy="19" r="1"/>
            <circle cx="17.5" cy="19" r="1"/>
        </svg>
    );
}

/** Распашные ворота — two pillars, top beam, symmetrical wings. */
export function SwingGateIcon(props: IconProps) {
    return (
        <svg {...base} {...props}>
            <path d="M4 21V8"/>
            <path d="M20 21V8"/>
            <path d="M4 8h16"/>
            <path d="M5.5 11l5.5 3v6l-5.5-3z"/>
            <path d="M18.5 11l-5.5 3v6l5.5-3z"/>
        </svg>
    );
}

/** Шлагбаум — pedestal with beacon and striped boom arm. */
export function BarrierIcon(props: IconProps) {
    return (
        <svg {...base} {...props}>
            <rect x="3" y="9" width="5" height="12" rx="1.5"/>
            <path d="M5.5 9V7.5"/>
            <circle cx="5.5" cy="6" r="1.5"/>
            <path d="M8 11h13"/>
            <path d="M11 11v2.5"/>
            <path d="M14.5 11v2.5"/>
            <path d="M18 11v2.5"/>
        </svg>
    );
}

/** Аксессуары — remote control / keyfob. */
export function RemoteIcon(props: IconProps) {
    return (
        <svg {...base} {...props}>
            <rect x="7" y="3" width="10" height="18" rx="2.5"/>
            <path d="M10.5 7h3"/>
            <path d="M10.5 11h3"/>
            <circle cx="12" cy="15.5" r="1"/>
        </svg>
    );
}
