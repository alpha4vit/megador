'use client';

import {useState} from 'react';
import {Sparkles} from 'lucide-react';

export type ColorType = 'solid' | 'texture' | 'digital';

export interface ColorItem {
    id: string;
    name: string;
    type: ColorType;
    value?: string;
    imageUrl?: string;
    code?: string;
    textColor?: 'light' | 'dark';
}

export interface ColorCollections {
    ral: ColorItem[];
    wood: ColorItem[];
    digital: ColorItem[];
}

interface ColorSelectorProps {
    colorCollections: ColorCollections;
    colors?: ColorItem[];
    title?: string;
    subtitle?: string;
    disclaimer?: string;
    showDigitalTab?: boolean;
}

export default function ColorSelector({colorCollections, title, subtitle, disclaimer, showDigitalTab = true}: ColorSelectorProps) {
    const [selectedColor, setSelectedColor] = useState<ColorItem>(colorCollections.ral[0]);
    const [activeTab, setActiveTab] = useState<keyof ColorCollections>('ral');

    const currentColors = colorCollections[activeTab];

    const tabBenefits: Record<keyof ColorCollections, string[]> = {
        ral: [
            'Стойкое полиуретановое покрытие (ПУР-ПА) со встроенными частицами полиамида',
            'Высокая устойчивость к выгоранию, коррозии, царапинам и моющим средствам',
            'Стабильный блеск и сохранение насыщенности цвета на протяжении десятков лет'
        ],
        wood: [
            'Двухслойное лаковое покрытие для надежной защиты от ультрафиолетовых лучей',
            'Абсолютная имитация благородной древесины со 100% реалистичностью текстуры',
            'Повышенная износостойкость панелей в условиях частых температурных перепадов'
        ],
        digital: []
    };

    const currentTabBenefits = tabBenefits[activeTab];

    const tabDisclaimers: Record<keyof ColorCollections, string> = {
        ral: '',
        wood: '',
        digital: disclaimer || 'В каталоге представлены популярные примеры цифровой печати. По вашему запросу мы можем нанести на полотно ворот абсолютно любое изображение высокого разрешения, индивидуальный паттерн или реплику текстуры.'
    };

    const currentDisclaimer = tabDisclaimers[activeTab];

    const getContrastTextColor = (backgroundColor: string): string => {
        if (!backgroundColor || backgroundColor === '#F8F9FA') return 'text-gray-700';

        const hex = backgroundColor.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);

        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance > 0.5 ? 'text-gray-900' : 'text-white';
    };

    const getTextColor = (color: ColorItem): string => {
        if (color.textColor === 'light') return 'text-white';
        if (color.textColor === 'dark') return 'text-gray-900';
        if (color.type === 'solid') return getContrastTextColor(color.value || '#F8F9FA');
        return 'text-white';
    };

    return (
        <>
            <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2F3E46] mb-2">
                    {title || 'Выбор цвета и текстуры'}
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto mb-5">
                    {subtitle || 'Широкая палитра RAL цветов и деревянных текстур для любого стиля фасада'}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* Preview Area */}
                <div
                    className="bg-[#F8F9FA] rounded-2xl p-4 flex items-center justify-center h-auto lg:h-full flex flex-col order-2 lg:order-1 lg:col-span-5">
                    <div className="w-full h-full min-h-[220px] lg:h-full flex flex-col items-center justify-center rounded-2xl">
                        <div
                            className="w-full h-full rounded-lg shadow-2xl transition-all duration-300 relative flex items-center justify-center p-4 overflow-hidden"
                            style={{
                                backgroundColor: selectedColor.type === 'solid' ? selectedColor.value : '#F8F9FA',
                                border: selectedColor.type === 'texture' || selectedColor.type === 'digital' ? '4px solid #2F3E46' : 'none'
                            }}
                        >
                            {(selectedColor.type === 'texture' || selectedColor.type === 'digital') && selectedColor.imageUrl ? (
                                <img draggable={false}
                                    src={selectedColor.imageUrl}
                                    alt={selectedColor.name}
                                    className="absolute inset-0 w-full h-full object-cover rounded-lg"
                                />
                            ) : (selectedColor.type === 'texture' || selectedColor.type === 'digital') && !selectedColor.imageUrl ? (
                                <div
                                    className="absolute inset-0 opacity-30 rounded-lg bg-gradient-to-br from-[#8B7355] to-[#4A3728]"/>
                            ) : null}
                            <div className="relative z-10 text-center">
                                <p className={`font-semibold text-lg drop-shadow-lg p-0.5 ${getTextColor(selectedColor)} ${selectedColor.type === 'digital' ? '[text-shadow:_0_0_3px_rgba(0,0,0,1),_0_0_6px_rgba(0,0,0,0.9),_0_0_12px_rgba(0,0,0,0.7)]' : ''}`}>
                                    {selectedColor.name}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Tab-specific Disclaimer - Below Preview (mobile/tablet only; on md+ it moves under the color grid) */}
                    {currentDisclaimer && (
                        <p className="md:hidden text-xs sm:text-sm text-gray-500 italic mt-4 w-full text-left pl-1 leading-relaxed">
                            {currentDisclaimer}
                        </p>
                    )}
                </div>

                {/* Color Selector - min-height locked on lg so tab switches don't resize the row;
                    shortest tab (wood) leaves empty space at the bottom instead of collapsing */}
                <div className="flex flex-col justify-start items-stretch order-1 lg:order-2 lg:col-span-7 lg:min-h-[430px]">

                    {/* Mobile Tab Navigation */}
                    <div
                        className="md:hidden flex overflow-x-auto whitespace-nowrap scrollbar-none gap-3 pb-2 mb-4 -mx-2 px-2"
                        data-component="color-tab-navigation"
                    >
                        <button
                            onClick={() => {
                                setActiveTab('ral');
                            }}
                            data-type="color-tab"
                            data-tab="ral"
                            className={`nav-tab-item px-4 py-2 rounded-lg text-sm font-medium transition-colors flex-shrink-0 ${activeTab === 'ral'
                                ? 'nav-tab-item--active bg-[#E65F2B] text-white'
                                : 'nav-tab-item--inactive bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Цветовая палитра RAL
                        </button>
                        <button
                            onClick={() => {
                                setActiveTab('wood');
                            }}
                            data-type="color-tab"
                            data-tab="wood"
                            className={`nav-tab-item px-4 py-2 rounded-lg text-sm font-medium transition-colors flex-shrink-0 ${activeTab === 'wood'
                                ? 'nav-tab-item--active bg-[#E65F2B] text-white'
                                : 'nav-tab-item--inactive bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Под дерево
                        </button>
                        {showDigitalTab && (
                            <button
                                onClick={() => {
                                    setActiveTab('digital');
                                }}
                                data-type="color-tab"
                                data-tab="digital"
                                className={`nav-tab-item px-4 py-2 rounded-lg text-sm font-medium transition-colors flex-shrink-0 ${activeTab === 'digital'
                                    ? 'nav-tab-item--active bg-[#E65F2B] text-white'
                                    : 'nav-tab-item--inactive bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                <span className="flex items-center gap-1.5">
                                    Цифровая печать
                                    <span className={`ml-1.5 px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-md transition-all ${
                                        activeTab === 'digital'
                                            ? 'bg-white/25 text-white'
                                            : 'bg-orange-500 text-white'
                                    }`}>
                                        Premium
                                    </span>
                                </span>
                            </button>
                        )}
                    </div>

                    {/* Desktop Tab Navigation */}
                    <div
                        className="hidden md:flex gap-3 mb-6"
                        data-component="color-tab-navigation"
                    >
                        <button
                            onClick={() => {
                                setActiveTab('ral');
                            }}
                            data-type="color-tab"
                            data-tab="ral"
                            className={`nav-tab-item px-6 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'ral'
                                ? 'nav-tab-item--active bg-[#E65F2B] text-white'
                                : 'nav-tab-item--inactive bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Цветовая палитра RAL
                        </button>
                        <button
                            onClick={() => {
                                setActiveTab('wood');
                            }}
                            data-type="color-tab"
                            data-tab="wood"
                            className={`nav-tab-item px-6 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'wood'
                                ? 'nav-tab-item--active bg-[#E65F2B] text-white'
                                : 'nav-tab-item--inactive bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Под дерево
                        </button>
                        {showDigitalTab && (
                            <button
                                onClick={() => {
                                    setActiveTab('digital');
                                }}
                                data-type="color-tab"
                                data-tab="digital"
                                className={`nav-tab-item px-6 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'digital'
                                    ? 'nav-tab-item--active bg-[#E65F2B] text-white'
                                    : 'nav-tab-item--inactive bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                <span className="flex items-center gap-1.5">
                                    Цифровая печать
                                    <span className={`ml-1.5 px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-md transition-all ${
                                        activeTab === 'digital'
                                            ? 'bg-white/25 text-white'
                                            : 'bg-orange-500 text-white'
                                    }`}>
                                        Premium
                                    </span>
                                </span>
                            </button>
                        )}
                    </div>

                    {/* Tab Content Grid Stack */}
                    <div className="grid grid-cols-1 items-start w-full">
                        {/* RAL Tab Panel */}
                        <div className={activeTab === 'ral' ? 'w-full' : 'hidden'}>
                            {/* Mobile Color Scroll Row */}
                            <div
                                className="md:hidden flex overflow-x-auto whitespace-nowrap scrollbar-none gap-3 py-3 pb-2 mb-3 -mx-2 px-2"
                                data-component="color-selector-scroll"
                            >
                                {colorCollections.ral.map((color) => (
                                    <div
                                        key={color.id}
                                        className={`color-selector-badge flex-shrink-0 flex flex-col overflow-hidden p-0 rounded-xl border-2 transition-all min-w-[130px] md:min-w-[150px] ${selectedColor.name === color.name
                                            ? 'color-selector-badge--active ring-2 ring-[#E65F2B] ring-offset-2 shadow-lg scale-105 border-gray-200'
                                            : 'color-selector-badge--inactive border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <button
                                            onClick={() => setSelectedColor(color)}
                                            data-style="ral-option"
                                            data-color-name={color.name}
                                            className="flex flex-col h-full"
                                        >
                                            <div
                                                className="w-full h-20 rounded-t-[10px] relative flex items-center justify-center"
                                                style={{
                                                    backgroundColor: color.type === 'solid' ? color.value : '#F8F9FA',
                                                    border: color.type === 'texture' || color.type === 'digital' ? '2px solid #2F3E46' : 'none'
                                                }}
                                            >
                                                {(color.type === 'texture' || color.type === 'digital') && color.imageUrl && (
                                                    <img draggable={false}
                                                        src={color.imageUrl}
                                                        alt={color.name}
                                                        className="absolute inset-0 w-full h-full object-cover rounded-t-[10px]"
                                                    />
                                                )}
                                                <p className={`text-xs font-medium text-center whitespace-normal relative z-10 p-0.5 ${getTextColor(color)} ${color.type === 'digital' ? '[text-shadow:_0_0_3px_rgba(0,0,0,1),_0_0_6px_rgba(0,0,0,0.9)]' : ''}`}>
                                                    {color.code}
                                                </p>
                                            </div>
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Desktop Color Grid */}
                            <div
                                className="hidden md:grid grid-cols-3 gap-4"
                                data-component="color-selector-grid"
                            >
                                {colorCollections.ral.map((color) => (
                                    <div
                                        key={color.id}
                                        className={`color-selector-badge flex flex-col overflow-hidden p-0 rounded-xl border-2 transition-all min-w-[130px] md:min-w-[150px] ${selectedColor.name === color.name
                                            ? 'color-selector-badge--active ring-2 ring-[#E65F2B] ring-offset-2 shadow-lg scale-105 border-gray-200'
                                            : 'color-selector-badge--inactive border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <button
                                            onClick={() => setSelectedColor(color)}
                                            data-style="ral-option"
                                            data-color-name={color.name}
                                            className="flex flex-col h-full"
                                        >
                                            <div
                                                className="w-full h-24 rounded-t-[10px] relative flex items-center justify-center"
                                                style={{
                                                    backgroundColor: color.type === 'solid' ? color.value : '#F8F9FA',
                                                    border: color.type === 'texture' || color.type === 'digital' ? '2px solid #2F3E46' : 'none'
                                                }}
                                            >
                                                {(color.type === 'texture' || color.type === 'digital') && color.imageUrl && (
                                                    <img draggable={false}
                                                        src={color.imageUrl}
                                                        alt={color.name}
                                                        className="absolute inset-0 w-full h-full object-cover rounded-t"
                                                    />
                                                )}
                                                <p className={`text-sm font-medium text-center whitespace-normal relative z-20 p-0.5 ${getTextColor(color)} ${color.type === 'digital' ? '[text-shadow:_0_0_3px_rgba(0,0,0,1),_0_0_6px_rgba(0,0,0,0.9)]' : ''}`}>
                                                    {color.code ?? color.name}
                                                </p>
                                            </div>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Wood Tab Panel */}
                        <div className={activeTab === 'wood' ? 'w-full' : 'hidden'}>
                            {/* Mobile Color Scroll Row */}
                            <div
                                className="md:hidden flex overflow-x-auto whitespace-nowrap scrollbar-none gap-3 py-3 pb-2 mb-3 -mx-2 px-2"
                                data-component="color-selector-scroll"
                            >
                                {colorCollections.wood.map((color) => (
                                    <div
                                        key={color.id}
                                        className={`color-selector-badge flex-shrink-0 flex flex-col overflow-hidden p-0 rounded-xl border-2 transition-all min-w-[130px] md:min-w-[150px] ${selectedColor.name === color.name
                                            ? 'color-selector-badge--active ring-2 ring-[#E65F2B] ring-offset-2 shadow-lg scale-105 border-gray-200'
                                            : 'color-selector-badge--inactive border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <button
                                            onClick={() => setSelectedColor(color)}
                                            data-style="ral-option"
                                            data-color-name={color.name}
                                            className="flex flex-col h-full"
                                        >
                                            <div
                                                className="w-full h-20 rounded-t-[10px] relative flex items-center justify-center"
                                                style={{
                                                    backgroundColor: color.type === 'solid' ? color.value : '#F8F9FA',
                                                    border: color.type === 'texture' || color.type === 'digital' ? '2px solid #2F3E46' : 'none'
                                                }}
                                            >
                                                {(color.type === 'texture' || color.type === 'digital') && color.imageUrl && (
                                                    <img draggable={false}
                                                        src={color.imageUrl}
                                                        alt={color.name}
                                                        className="absolute inset-0 w-full h-full object-cover rounded-t-[10px]"
                                                    />
                                                )}
                                                <p className={`text-xs font-medium text-center whitespace-normal relative z-10 p-0.5 ${getTextColor(color)} ${color.type === 'digital' ? '[text-shadow:_0_0_3px_rgba(0,0,0,1),_0_0_6px_rgba(0,0,0,0.9)]' : ''}`}>
                                                    {color.code}
                                                </p>
                                            </div>
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Desktop Color Grid */}
                            <div
                                className="hidden md:grid grid-cols-3 gap-4"
                                data-component="color-selector-grid"
                            >
                                {colorCollections.wood.map((color) => (
                                    <div
                                        key={color.id}
                                        className={`color-selector-badge flex flex-col overflow-hidden p-0 rounded-xl border-2 transition-all min-w-[130px] md:min-w-[150px] ${selectedColor.name === color.name
                                            ? 'color-selector-badge--active ring-2 ring-[#E65F2B] ring-offset-2 shadow-lg scale-105 border-gray-200'
                                            : 'color-selector-badge--inactive border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <button
                                            onClick={() => setSelectedColor(color)}
                                            data-style="ral-option"
                                            data-color-name={color.name}
                                            className="flex flex-col h-full"
                                        >
                                            <div
                                                className="w-full h-24 rounded-t-[10px] relative flex items-center justify-center"
                                                style={{
                                                    backgroundColor: color.type === 'solid' ? color.value : '#F8F9FA',
                                                    border: color.type === 'texture' || color.type === 'digital' ? '2px solid #2F3E46' : 'none'
                                                }}
                                            >
                                                {(color.type === 'texture' || color.type === 'digital') && color.imageUrl && (
                                                    <img draggable={false}
                                                        src={color.imageUrl}
                                                        alt={color.name}
                                                        className="absolute inset-0 w-full h-full object-cover rounded-t"
                                                    />
                                                )}
                                                <p className={`text-sm font-medium text-center whitespace-normal relative z-20 p-0.5 ${getTextColor(color)} ${color.type === 'digital' ? '[text-shadow:_0_0_3px_rgba(0,0,0,1),_0_0_6px_rgba(0,0,0,0.9)]' : ''}`}>
                                                    {color.code ?? color.name}
                                                </p>
                                            </div>
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Tab-specific Benefits Block - Desktop Only.
                                Mounted exclusively for the active wood tab so inactive panels
                                don't reserve layout height inside the stacked grid cell. */}
                            {activeTab === 'wood' && !currentDisclaimer && (
                                <div className="hidden lg:block mt-8 pt-6 border-t border-gray-100 animate-fadeIn">
                                    <div className="space-y-3">
                                        <p className="text-xs uppercase font-bold tracking-wider text-gray-400 mb-2">Технологические преимущества покрытия:</p>
                                        {tabBenefits.wood.map((bullet, idx) => (
                                            <div key={idx} className="flex items-center gap-2 text-sm text-[#2F3E46]">
                                                <span className="text-[#E65F2B] font-bold">✓</span>
                                                <span>{bullet}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Digital Tab Panel */}
                        {showDigitalTab && (
                            <div className={activeTab === 'digital' ? 'w-full' : 'hidden'}>
                            {/* Mobile Color Scroll Row */}
                            <div
                                className="md:hidden flex overflow-x-auto whitespace-nowrap scrollbar-none gap-3 py-3 pb-2 mb-3 -mx-2 px-2"
                                data-component="color-selector-scroll"
                            >
                                {colorCollections.digital.map((color) => (
                                    <div
                                        key={color.id}
                                        className={`color-selector-badge flex-shrink-0 flex flex-col overflow-hidden p-0 rounded-xl border-2 transition-all min-w-[130px] md:min-w-[150px] ${selectedColor.name === color.name
                                            ? 'color-selector-badge--active ring-2 ring-[#E65F2B] ring-offset-2 shadow-lg scale-105 border-gray-200'
                                            : 'color-selector-badge--inactive border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <button
                                            onClick={() => setSelectedColor(color)}
                                            data-style="ral-option"
                                            data-color-name={color.name}
                                            className="flex flex-col h-full"
                                        >
                                            <div
                                                className="w-full h-20 rounded-t-[10px] relative flex items-center justify-center"
                                                style={{
                                                    backgroundColor: color.type === 'solid' ? color.value : '#F8F9FA',
                                                    border: color.type === 'texture' || color.type === 'digital' ? '2px solid #2F3E46' : 'none'
                                                }}
                                            >
                                                {(color.type === 'texture' || color.type === 'digital') && color.imageUrl && (
                                                    <img draggable={false}
                                                        src={color.imageUrl}
                                                        alt={color.name}
                                                        className="absolute inset-0 w-full h-full object-cover rounded-t-[10px]"
                                                    />
                                                )}
                                                <p className={`text-xs font-medium text-center whitespace-normal relative z-10 p-0.5 ${getTextColor(color)} ${color.type === 'digital' ? '[text-shadow:_0_0_3px_rgba(0,0,0,1),_0_0_6px_rgba(0,0,0,0.9)]' : ''}`}>
                                                    {color.code}
                                                </p>
                                            </div>
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Desktop Color Grid */}
                            <div
                                className="hidden md:grid grid-cols-3 gap-4"
                                data-component="color-selector-grid"
                            >
                                {colorCollections.digital.map((color) => (
                                    <div
                                        key={color.id}
                                        className={`color-selector-badge flex flex-col overflow-hidden p-0 rounded-xl border-2 transition-all min-w-[130px] md:min-w-[150px] ${selectedColor.name === color.name
                                            ? 'color-selector-badge--active ring-2 ring-[#E65F2B] ring-offset-2 shadow-lg scale-105 border-gray-200'
                                            : 'color-selector-badge--inactive border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <button
                                            onClick={() => setSelectedColor(color)}
                                            data-style="ral-option"
                                            data-color-name={color.name}
                                            className="flex flex-col h-full"
                                        >
                                            <div
                                                className="w-full h-24 rounded-t-[10px] relative flex items-center justify-center"
                                                style={{
                                                    backgroundColor: color.type === 'solid' ? color.value : '#F8F9FA',
                                                    border: color.type === 'texture' || color.type === 'digital' ? '2px solid #2F3E46' : 'none'
                                                }}
                                            >
                                                {(color.type === 'texture' || color.type === 'digital') && color.imageUrl && (
                                                    <img draggable={false}
                                                        src={color.imageUrl}
                                                        alt={color.name}
                                                        className="absolute inset-0 w-full h-full object-cover rounded-t"
                                                    />
                                                )}
                                                <p className={`text-sm font-medium text-center whitespace-normal relative z-20 p-0.5 ${getTextColor(color)} ${color.type === 'digital' ? '[text-shadow:_0_0_3px_rgba(0,0,0,1),_0_0_6px_rgba(0,0,0,0.9)]' : ''}`}>
                                                    {color.code ?? color.name}
                                                </p>
                                            </div>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        )}
                    </div>

                    {/* Tab-specific Disclaimer - Below color grid (desktop only) */}
                    {currentDisclaimer && (
                        <p className="hidden md:block mt-6 text-xs sm:text-sm text-gray-500 italic w-full text-left leading-relaxed">
                            {currentDisclaimer}
                        </p>
                    )}
                </div>
            </div>
        </>
    );
}
