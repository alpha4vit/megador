'use client';

import { LucideIcon } from 'lucide-react';

export interface Step {
    icon: LucideIcon;
    time: string;
    title: string;
    description: string;
}

interface ProcessMapProps {
    steps: Step[];
}

export default function ProcessMap({ steps }: ProcessMapProps) {
    // Generate dynamic mobile SVG path based on alternating layout
    const generateMobilePath = () => {
        if (!steps?.length) return '';
        
        const totalHeight = 400;
        const stepHeight = totalHeight / steps.length;
        
        let path = `M 50 0`;
        
        steps.forEach((_, index) => {
            const yStart = index * stepHeight;
            const yEnd = (index + 1) * stepHeight;
            const yMid = (yStart + yEnd) / 2;
            
            // Even index: element on left, curve swings to center-left (35)
            // Odd index: element on right, curve swings to center-right (65)
            const targetX = index % 2 === 0 ? 35 : 65;
            const controlX = index % 2 === 0 ? 35 : 65;
            
            // Add curve segment
            path += ` C 50 ${yStart + 20}, ${controlX} ${yMid - 20}, ${targetX} ${yMid}`;
            path += ` C ${controlX} ${yMid + 20}, 50 ${yEnd - 20}, 50 ${yEnd}`;
        });
        
        return path;
    };

    // Smooth a set of points into a cubic-bezier SVG path (Catmull-Rom -> Bezier)
    const buildWavePath = (centers: { x: number; y: number }[]) => {
        const pts = [{ x: 0, y: 50 }, ...centers, { x: 1200, y: 50 }];
        let d = `M ${pts[0].x} ${pts[0].y}`;
        for (let i = 0; i < pts.length - 1; i++) {
            const p0 = pts[Math.max(0, i - 1)];
            const p1 = pts[i];
            const p2 = pts[i + 1];
            const p3 = pts[Math.min(pts.length - 1, i + 2)];
            const c1x = p1.x + (p2.x - p0.x) / 6;
            const c1y = p1.y + (p2.y - p0.y) / 6;
            const c2x = p2.x - (p3.x - p1.x) / 6;
            const c2y = p2.y - (p3.y - p1.y) / 6;
            d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2.x} ${p2.y}`;
        }
        return d;
    };

    // Desktop horizontal wave: center points are tuned per step count so the
    // trail passes through the middle of every badge column.
    const getDesktopTrail = (count: number): string => {
        switch (count) {
            case 3:
                return buildWavePath([
                    { x: 200, y: 30 },
                    { x: 600, y: 70 },
                    { x: 1000, y: 30 },
                ]);
            case 5:
                return buildWavePath([
                    { x: 120, y: 30 },
                    { x: 360, y: 70 },
                    { x: 600, y: 30 },
                    { x: 840, y: 70 },
                    { x: 1080, y: 30 },
                ]);
            case 4:
            default:
                return buildWavePath([
                    { x: 150, y: 30 },
                    { x: 450, y: 70 },
                    { x: 750, y: 30 },
                    { x: 1050, y: 70 },
                ]);
        }
    };

    const stepCount = steps?.length ?? 0;

    return (
        <div className="relative py-8 overflow-hidden" data-steps-count={stepCount}>
            {/* Mobile: Vertical winding zigzag SVG trail */}
            <svg 
                className="absolute inset-0 z-0 pointer-events-none block md:hidden"
                viewBox="0 0 100 400"
                preserveAspectRatio="none"
            >
                <path
                    d={generateMobilePath()}
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="1.5"
                    strokeDasharray="6,6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>

            {/* Desktop: Horizontal wave SVG trail - pinned to a top band so it floats
                above the icons instead of cutting through them */}
            <svg 
                className="absolute top-8 left-0 right-0 w-full h-16 z-0 pointer-events-none hidden md:block"
                viewBox="0 0 1200 100"
                preserveAspectRatio="none"
            >
                <path
                    d={getDesktopTrail(stepCount)}
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="3"
                    strokeDasharray="8,8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>

            {/* Steps Container - extra top padding on md+ drops the icons below the line band */}
            <div className="flex flex-col md:flex-row relative z-10 gap-16 md:gap-0 md:pt-16">
                {steps.map((step, index) => {
                    const Icon = step.icon;
                    const isEven = index % 2 === 0;
                    
                    return (
                        <div 
                            key={index} 
                            className={`flex-1 relative flex flex-col ${
                                index === 0 ? 'md:translate-y-0' : 
                                index === 1 ? 'md:translate-y-8' : 
                                index === 2 ? 'md:translate-y-0' : 
                                'md:translate-y-8'
                            }`}
                        >
                            {/* Mobile: Alternating left/right alignment for winding trail */}
                            <div className={`md:hidden flex items-center gap-4 w-full ${isEven ? 'flex-row' : 'flex-row-reverse'}`}>
                                {/* Icon Island */}
                                <div className="flex-shrink-0">
                                    <div className="w-14 h-14 rounded-xl bg-[#E65F2B] flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300">
                                        <Icon className="text-white" size={24} strokeWidth={2}/>
                                    </div>
                                </div>
                                
                                {/* Content: Time + Title */}
                                <div className={`flex-1 ${isEven ? 'text-left pl-3' : 'text-right pr-3'}`}>
                                    <div className="text-xs font-bold text-[#E65F2B] mb-1">
                                        {step.time}
                                    </div>
                                    <h3 className="text-base font-bold text-[#2F3E46]">
                                        {step.title}
                                    </h3>
                                </div>
                            </div>

                            {/* Desktop: Compact milestone */}
                            <div className="hidden md:flex flex-col items-center gap-3">
                                {/* Icon Island with hover effect */}
                                <div className="w-14 h-14 rounded-xl bg-[#E65F2B] flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300">
                                    <Icon className="text-white" size={24} strokeWidth={2}/>
                                </div>
                                
                                {/* Time Badge */}
                                <div className="text-xs font-bold text-[#E65F2B]">
                                    {step.time}
                                </div>
                                
                                {/* Title */}
                                <h3 className="text-lg font-bold text-[#2F3E46] text-center">
                                    {step.title}
                                </h3>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
