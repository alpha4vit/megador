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
        if (steps.length === 0) return '';
        
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

    return (
        <div className="relative py-8 overflow-hidden">
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

            {/* Desktop: Horizontal wave SVG trail */}
            <svg 
                className="absolute inset-0 z-0 pointer-events-none hidden md:block"
                viewBox="0 0 1200 100"
                preserveAspectRatio="none"
            >
                <path
                    d="M 50 50 C 200 50, 250 20, 350 50 C 450 80, 500 80, 600 50 C 700 20, 750 20, 850 50 C 950 80, 1000 80, 1150 50"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="3"
                    strokeDasharray="8,8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>

            {/* Steps Container */}
            <div className="flex flex-col md:flex-row relative z-10 gap-16 md:gap-0">
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
