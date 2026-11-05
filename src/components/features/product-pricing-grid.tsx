'use client';

import {useState, useRef} from 'react';
import {ChevronLeft, ChevronRight, ChevronDown} from 'lucide-react';
import {Button} from '@/components/ui/button';

export interface PricingFeature {
    label: string;
    value: string;
}

export interface PricingTier {
    id: string;
    title: string;
    subtitle: string;
    badgeText: string;
    badgeStyle: string;
    features: PricingFeature[];
    price: string;
    productActionKey: string;
}

export interface ComparisonTableRow {
    characteristic: string;
    values: string[];
}

export interface ComparisonContentBlock {
    title: string;
    items: Array<{
        tierName: string;
        badgeStyle: string;
        content: string;
        value?: string;
    }>;
}

export interface ProductPricingGridProps {
    title: string;
    subtitle: string;
    tiers: PricingTier[];
    comparisonMatrix?: {
        type: 'table' | 'content-blocks';
        tableHeaders?: string[];
        tableRows?: ComparisonTableRow[];
        contentBlocks?: ComparisonContentBlock[];
    };
    desktopGridCols?: 2 | 3 | 4;
    onProductClick?: (tier: PricingTier) => void;
}

export default function ProductPricingGrid({
    title,
    subtitle,
    tiers,
    comparisonMatrix,
    desktopGridCols = 3,
    onProductClick
}: ProductPricingGridProps) {
    const [isComparisonOpen, setIsComparisonOpen] = useState(false);
    const [activePricingSlide, setActivePricingSlide] = useState(0);
    const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
    const pricingCarouselRef = useRef<HTMLDivElement>(null);

    const toggleCardSpecs = (tierId: string) => {
        setExpandedCards(prev => ({ ...prev, [tierId]: !prev[tierId] }));
    };

    const handlePricingCarouselScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const container = e.currentTarget;
        const cardElement = container.firstElementChild as HTMLElement;

        if (cardElement) {
            const scrollLeft = container.scrollLeft;
            const maxScrollLeft = container.scrollWidth - container.clientWidth;
            const cardWidth = cardElement.getBoundingClientRect().width;
            const gap = 16;
            const totalCards = tiers.length;

            let newIndex = Math.round(scrollLeft / (cardWidth + gap));

            // CRITICAL FIX: If the container is scrolled to the absolute maximum right edge, force the last index
            if (scrollLeft >= maxScrollLeft - 5) {
                newIndex = totalCards - 1;
            }

            if (newIndex >= 0 && newIndex < totalCards) {
                setActivePricingSlide(newIndex);
            }
        }
    };

    const handlePrevSlide = () => {
        if (pricingCarouselRef.current) {
            const container = pricingCarouselRef.current;
            const cardWidth = container.firstElementChild?.clientWidth || container.clientWidth;
            const gap = 16;
            const nextIndex = Math.max(0, activePricingSlide - 1);
            setActivePricingSlide(nextIndex);
            container.scrollTo({
                left: nextIndex * (cardWidth + gap),
                behavior: 'smooth',
            });
        }
    };

    const handleNextSlide = () => {
        if (pricingCarouselRef.current) {
            const container = pricingCarouselRef.current;
            const totalCards = tiers.length;
            const nextIndex = Math.min(totalCards - 1, activePricingSlide + 1);
            setActivePricingSlide(nextIndex);

            if (nextIndex === totalCards - 1) {
                container.scrollTo({ left: container.scrollWidth, behavior: 'smooth' });
            } else {
                const cardWidth = container.firstElementChild?.clientWidth || container.clientWidth;
                const gap = 16;
                container.scrollTo({ left: nextIndex * (cardWidth + gap), behavior: 'smooth' });
            }
        }
    };

    const handleDotClick = (index: number) => {
        if (pricingCarouselRef.current) {
            pricingCarouselRef.current.scrollTo({
                left: index * pricingCarouselRef.current.offsetWidth,
                behavior: 'smooth',
            });
        }
    };

    return (
        <>
            <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2F3E46] mb-4">
                    {title}
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    {subtitle}
                </p>
            </div>

            <div
                ref={pricingCarouselRef}
                onScroll={handlePricingCarouselScroll as unknown as React.UIEventHandler<HTMLDivElement>}
                className={`flex overflow-x-auto whitespace-nowrap scrollbar-none gap-4 pb-4 mb-6 -mx-4 px-4 snap-x snap-mandatory lg:grid lg:overflow-visible lg:mx-0 lg:px-0 lg:mx-auto lg:justify-center ${
                    desktopGridCols === 4 ? 'lg:grid-cols-4 lg:max-w-[1400px]' : desktopGridCols === 3 ? 'lg:grid-cols-3 lg:max-w-[1200px]' : 'lg:grid-cols-2 lg:max-w-[900px]'
                }`}
                style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}
            >
                {tiers.map((tier) => (
                    <div
                        key={tier.id}
                        className="w-full max-w-full flex-shrink-0 snap-center whitespace-normal bg-gray-100 rounded-xl shadow-lg overflow-hidden border border-gray-100 flex flex-col justify-between"
                    >
                        <div className="flex flex-col flex-grow">
                            <div className="p-5 border-b border-gray-200">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-xl font-bold text-[#2F3E46]">{tier.title}</h3>
                                    <span
                                        className={`px-3 py-1 ${tier.badgeStyle} text-white text-xs font-semibold rounded-full`}
                                    >
                                        {tier.badgeText}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500">{tier.subtitle}</p>
                            </div>
                            <div className="p-5 space-y-3 flex-grow flex flex-col">
                                {(expandedCards[tier.id] ? tier.features : tier.features.slice(0, 3)).map((feature, idx) => (
                                    <div key={idx} className="grid grid-cols-12 gap-4 py-2.5 border-b border-gray-100 items-start whitespace-normal w-full">
                                        <span className="col-span-5 text-sm text-gray-500 font-medium select-none">{feature.label}</span>
                                        <span className="col-span-7 text-sm font-semibold text-[#2F3E46] text-right leading-relaxed block break-words">{feature.value}</span>
                                    </div>
                                ))}
                                {tier.features.length > 3 && (
                                    <button
                                        onClick={() => toggleCardSpecs(tier.id)}
                                        className="flex lg:hidden items-center justify-center gap-1.5 w-full py-2.5 text-xs font-semibold text-[#E65F2B] hover:text-orange-600 transition-colors mt-auto pt-4 select-none"
                                    >
                                        <span>{expandedCards[tier.id] ? 'Скрыть характеристики' : 'Все характеристики'}</span>
                                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${expandedCards[tier.id] ? 'rotate-180' : ''}`} />
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="p-5 bg-[#F8F9FA]">
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <div className="text-2xl font-bold text-[#E65F2B]">{tier.price}</div>
                                    <div className="text-xs text-gray-500">с учетом монтажа</div>
                                </div>
                            </div>
                            <Button
                                size="lg"
                                className="w-full cta-button-primary"
                                onClick={() => onProductClick?.(tier)}
                            >
                                Заказать замер
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Controls (< 1024px) */}
            <div className="flex lg:hidden items-center justify-center gap-6 mt-6 mb-4 w-full">
                <button
                    onClick={handlePrevSlide}
                    disabled={activePricingSlide === 0}
                    className={`p-2 rounded-full transition-all ${
                        activePricingSlide === 0
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-[#E65F2B] hover:bg-orange-50'
                    }`}
                    aria-label="Previous slide"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>

                {/* Mobile Carousel Dots */}
                <div className="flex justify-center items-center gap-2">
                    {tiers.map((_, index) => (
                        <button
                            key={index}
                            className={`${
                                index === activePricingSlide
                                    ? 'w-5 h-2 rounded-full bg-[#E65F2B]'
                                    : 'w-2 h-2 rounded-full bg-gray-300'
                            } transition-all duration-300`}
                            onClick={() => handleDotClick(index)}
                            aria-label={`Slide ${index + 1}`}
                        />
                    ))}
                </div>

                <button
                    onClick={handleNextSlide}
                    disabled={activePricingSlide === tiers.length - 1}
                    className={`p-2 rounded-full transition-all ${
                        activePricingSlide === tiers.length - 1
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-[#E65F2B] hover:bg-orange-50'
                    }`}
                    aria-label="Next slide"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>

            {/* Expandable Comparison */}
            {comparisonMatrix && (
                <div className="mt-12">
                    <button
                        onClick={() => setIsComparisonOpen(!isComparisonOpen)}
                        className="comparison-toggle-btn mx-auto flex items-center gap-2 border-2 border-[#E65F2B] text-[#E65F2B] font-medium px-6 py-3 rounded-xl hover:bg-[#F8F9FA] transition-all"
                        data-action="expand-comparison"
                    >
                        <span>Подробное сравнение серий</span>
                        <svg
                            className={`w-5 h-5 transition-transform ${isComparisonOpen ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                        </svg>
                    </button>

                    {isComparisonOpen && comparisonMatrix.type === 'table' && comparisonMatrix.tableRows && (
                        <>
                            {/* Desktop Table */}
                            <div className="hidden lg:block bg-[#F8F9FA]/50 p-6 rounded-xl mt-4 overflow-x-auto">
                                <table className="w-full min-w-[600px] border-collapse">
                                    <thead>
                                        <tr className="border-b-2 border-gray-200">
                                            <th className="text-left py-3 px-4 font-bold text-[#2F3E46] text-sm">Характеристика</th>
                                            {comparisonMatrix.tableHeaders?.map((header, idx) => (
                                                <th key={idx} className="text-left py-3 px-4 font-bold text-[#2F3E46] text-sm">{header}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {comparisonMatrix.tableRows.map((row, idx) => (
                                            <tr key={idx} className="border-b border-gray-100 even:bg-gray-50/50">
                                                <td className="py-3 px-4 text-sm font-medium text-gray-700">{row.characteristic}</td>
                                                {row.values.map((value, vIdx) => (
                                                    <td key={vIdx} className="py-3 px-4 text-sm text-gray-600">{value}</td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Vertical Stack */}
                            <div className="block lg:hidden space-y-8 mt-4">
                                {/* BLOCK 1: Назначение и Профиль */}
                                <div>
                                    <h4 className="text-base font-bold text-[#2F3E46] mb-3 block pl-1">Назначение и Профиль</h4>
                                    <div className="space-y-3">
                                        {/* Trend */}
                                        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-3">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="px-3 py-1 bg-slate-900 text-white text-xs font-semibold rounded-full">Trend</span>
                                                <span className="font-semibold text-[#2F3E46]">Базовая защита</span>
                                            </div>
                                            <p className="text-sm text-gray-600 leading-relaxed">
                                                Практичное и экономичное решение. Используется профиль роликовой прокатки AG/77 со стандартным пенозаполнением и толщиной ленты ~0.36 мм. Подходит для дач и внутренних перегородок.
                                            </p>
                                        </div>
                                        {/* Prestige */}
                                        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-3">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="px-3 py-1 bg-[#E65F2B] text-white text-xs font-semibold rounded-full">Prestige</span>
                                                <span className="font-semibold text-[#2F3E46]">Повышенный комфорт</span>
                                            </div>
                                            <p className="text-sm text-gray-600 leading-relaxed">
                                                Максимальный уют и стиль. Алюминиевый профиль высокой плотности или термопрофиль с толщиной ленты ~0.49 мм. Идеально для частных домов и коттеджей.
                                            </p>
                                        </div>
                                        {/* Security */}
                                        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-3">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="px-3 py-1 bg-red-700 text-white text-xs font-semibold rounded-full">Security</span>
                                                <span className="font-semibold text-[#2F3E46]">Противовзломная защита</span>
                                            </div>
                                            <p className="text-sm text-gray-600 leading-relaxed">
                                                Повышенная безопасность VIP-объектов. Экструдированный цельноалюминиевый толстостенный профиль с ребром жесткости (1.0–1.5 мм).
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* BLOCK 2: Взломостойкость и ветровая устойчивость */}
                                <div>
                                    <h4 className="text-base font-bold text-[#2F3E46] mb-3 block pl-1">Взломостойкость и ветровая устойчивость</h4>
                                    <div className="space-y-3">
                                        {/* Trend */}
                                        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-3">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="px-3 py-1 bg-slate-900 text-white text-xs font-semibold rounded-full">Trend</span>
                                            </div>
                                            <p className="text-sm text-gray-600 leading-relaxed">
                                                Класс Р1 взломостойкости. Конструкция рассчитана на стандартные ветровые нагрузки в охраняемых зонах.
                                            </p>
                                        </div>
                                        {/* Prestige */}
                                        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-3">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="px-3 py-1 bg-[#E65F2B] text-white text-xs font-semibold rounded-full">Prestige</span>
                                            </div>
                                            <p className="text-sm text-gray-600 leading-relaxed">
                                                Класс Р1 + стойкость к деформациям. Повышенная жесткость конструкции позволяет выдерживать ураганные ветры на широких проемах.
                                            </p>
                                        </div>
                                        {/* Security */}
                                        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-3">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="px-3 py-1 bg-red-700 text-white text-xs font-semibold rounded-full">Security</span>
                                            </div>
                                            <p className="text-sm text-gray-600 leading-relaxed">
                                                Высокий класс Р3–Р5. Сертифицированная противовзломная защита для банков, складов и ювелирных магазинов.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* BLOCK 3: Теплоизоляция и цветовая палитра */}
                                <div>
                                    <h4 className="text-base font-bold text-[#2F3E46] mb-3 block pl-1">Теплоизоляция и цветовая палитра</h4>
                                    <div className="space-y-3">
                                        {/* Trend */}
                                        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-3">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="px-3 py-1 bg-slate-900 text-white text-xs font-semibold rounded-full">Trend</span>
                                            </div>
                                            <p className="text-sm text-gray-600 leading-relaxed">
                                                Стандартная теплоизоляция и защита от солнца. Доступен базовый набор популярных цветовых оттенков Алютех.
                                            </p>
                                        </div>
                                        {/* Prestige */}
                                        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-3">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="px-3 py-1 bg-[#E65F2B] text-white text-xs font-semibold rounded-full">Prestige</span>
                                            </div>
                                            <p className="text-sm text-gray-600 leading-relaxed">
                                                Высокая энергоэффективность (снижает теплопотери зимой до 30%, летом задерживает до 70% тепла). Расширенная палитра цветов (более 30 вариантов).
                                            </p>
                                        </div>
                                        {/* Security */}
                                        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-3">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="px-3 py-1 bg-red-700 text-white text-xs font-semibold rounded-full">Security</span>
                                            </div>
                                            <p className="text-sm text-gray-600 leading-relaxed">
                                                Минимальная теплоизоляция. Основной акцент сделан на физическую прочность металла. Доступен ограниченный выбор стандартных защитных цветов.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {isComparisonOpen && comparisonMatrix.type === 'content-blocks' && comparisonMatrix.contentBlocks && (
                        <div className="bg-[#F8F9FA]/50 p-6 rounded-xl mt-4 space-y-6">
                            {comparisonMatrix.contentBlocks.map((block, idx) => (
                                <div key={idx} className="comparison-content-block">
                                    <h4 className="text-lg font-bold text-[#2F3E46] mb-3">{block.title}</h4>
                                    <div className="space-y-3">
                                        {block.items.map((item, iIdx) => (
                                            <div key={iIdx} className="bg-white p-4 rounded-lg">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span
                                                        className={`px-3 py-1 ${item.badgeStyle} text-white text-xs font-semibold rounded-full`}
                                                    >
                                                        {item.tierName}
                                                    </span>
                                                    {item.value && <span className="font-semibold text-[#2F3E46]">{item.value}</span>}
                                                </div>
                                                <p className="text-sm text-gray-600">{item.content}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
