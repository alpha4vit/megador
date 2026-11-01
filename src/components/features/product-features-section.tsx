import {ReactNode} from 'react';

export interface FeatureBullet {
    text: string;
}

export interface FeatureCard {
    id: string;
    title: string;
    description: string;
    icon?: React.ComponentType<{className?: string; size?: number}>;
    bullets: FeatureBullet[];
}

export interface ProductFeaturesSectionProps {
    sectionId?: string;
    backgroundColor?: 'white' | 'gray';
    sectionTitle: string;
    description: string;
    cards: FeatureCard[];
}

export default function ProductFeaturesSection({
    sectionId,
    backgroundColor = 'gray',
    sectionTitle,
    description,
    cards,
}: ProductFeaturesSectionProps) {
    const bgClass = backgroundColor === 'white' 
        ? 'bg-white border-y border-gray-100' 
        : 'bg-zinc-50 border-y border-gray-100';

    return (
        <section id={sectionId} className={`w-full ${bgClass} py-12 lg:py-24`}>
            <div className="max-w-[1200px] mx-auto px-4">
                <div className="text-center mt-0 mb-4 lg:mt-0 lg:mb-6">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2F3E46] mb-4">
                        {sectionTitle}
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        {description}
                    </p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
                    {cards.map((card) => (
                        <div
                            key={card.id}
                            className="h-full flex flex-col justify-between bg-white rounded-2xl p-5 lg:p-6 shadow-sm border border-gray-100"
                        >
                            <div>
                                <div className="flex items-start gap-4 mb-4">
                                    {card.icon && (
                                        <div className="w-12 h-12 rounded-xl bg-[#F8F9FA] flex items-center justify-center flex-shrink-0 text-[#2F3E46]">
                                            <card.icon className="w-6 h-6" />
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-[#2F3E46] mb-2">
                                            {card.title}
                                        </h3>

                                    </div>
                                </div>
                                <p className="text-gray-600 leading-relaxed">
                                    {card.description}
                                </p>
                                <ul className="space-y-2 mt-4">
                                    {card.bullets.map((bullet, idx) => (
                                        <li key={idx} className="flex items-start gap-2">
                                            <span className="w-1.5 h-0.5 rounded-full bg-[#E65F2B] mt-2 flex-shrink-0" />
                                            <span className="text-sm text-gray-600">{bullet.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
