'use client';

import {useState, useEffect} from 'react';
import Link from 'next/link';
import {ArrowRight, Check, Calendar, Wrench, CreditCard, ClipboardCheck, X} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Section} from '@/components/ui/section';
import {Container} from '@/components/ui/container';
import ProcessMap, {Step} from '@/components/features/process-map';

interface Product {
    id: string;
    title: string;
    subtitle: string;
    badgeText: string;
    badgeStyle: string;
    specs: string[];
    price: string;
    productActionKey: string;
    image: string;
    buttonText?: string;
    description?: string;
}

function ProductGrid({ products, onProductClick }: { products: Product[]; onProductClick: (product: Product) => void }) {
    // Calculate optimal desktop columns for balanced layout
    const getDesktopColumns = (count: number): number => {
        if (count % 3 === 0) return 3; // 6, 9 items -> 3 columns for balanced rows
        if (count === 4) return 4; // 4 items -> 4 columns for single row
        return 4; // Default to 4 columns
    };

    const desktopColumns = getDesktopColumns(products.length);
    const lgGridClass = desktopColumns === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4';

    return (
        <div className={`grid grid-cols-2 gap-3 md:gap-6 md:grid-cols-3 ${lgGridClass}`}>
            {products.map((product) => (
                <div
                    key={product.id}
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between cursor-pointer"
                    onClick={() => onProductClick(product)}
                >
                    {/* Top Area: Product Image */}
                    <div className="w-full aspect-square bg-slate-50 flex items-center justify-center p-2 rounded-t-lg overflow-hidden">
                        <img
                            src={product.image}
                            alt={product.title}
                            className="w-full h-full object-contain mix-blend-multiply"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                            }}
                        />
                    </div>

                    {/* Middle Area: Content & Badges */}
                    <div className="p-3 flex flex-col flex-grow">
                        <div className="flex flex-col gap-1.5 mb-2">
                            <span
                                className={`px-2 py-0.5 ${product.badgeStyle} text-white text-[10px] font-semibold rounded-full whitespace-nowrap w-fit`}
                            >
                                {product.badgeText}
                            </span>
                            <h4 className="text-sm font-bold text-[#2F3E46] leading-tight">
                                {product.title}
                            </h4>
                        </div>
                        <p className="text-xs text-gray-500 mb-3 line-clamp-1">{product.subtitle}</p>
                        {product.description && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onProductClick(product);
                                }}
                                className="text-xs text-[#E65F2B] font-semibold hover:underline mb-3"
                            >
                                Подробнее
                            </button>
                        )}
                        
                        {/* Key Specifications */}
                        <div className="space-y-1 flex-grow">
                            {product.specs.slice(0, 3).map((spec, idx) => (
                                <div key={idx} className="text-xs text-gray-600 flex items-center gap-1">
                                    <div className="w-1 h-1 bg-gray-300 rounded-full flex-shrink-0"/>
                                    <span className="truncate">{spec}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom Area: Price & Action */}
                    <div className="p-3 pt-0 border-t border-gray-100 mt-auto">
                        <div className="mb-2">
                            <div className="text-base font-bold text-[#E65F2B]">{product.price}</div>
                        </div>
                        <Button
                            size="sm"
                            className="w-full text-xs cta-button-primary"
                            data-action="measurement-request"
                            data-product={product.productActionKey}
                        >
                            ЗАКАЗАТЬ
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function AutomationSlidingPage() {
    const [activeTab, setActiveTab] = useState<'nice-alutech' | 'hispeed'>('nice-alutech');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    // Handle escape key to close modal
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && selectedProduct && !isClosing) {
                handleClose();
            }
        };

        if (selectedProduct) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [selectedProduct, isClosing]);

    const handleClose = () => {
        if (isClosing) return;
        setIsClosing(true);
        setIsAnimating(true);
        setIsMounted(false);
        setTimeout(() => {
            setSelectedProduct(null);
            setIsClosing(false);
            setIsAnimating(false);
        }, 300);
    };

    // Trigger enter animation after mount
    useEffect(() => {
        if (selectedProduct) {
            setIsMounted(false);
            const timeout = setTimeout(() => {
                setIsMounted(true);
            }, 10);
            return () => clearTimeout(timeout);
        }
    }, [selectedProduct]);

    // Tab 1: Приводы NICE & Alutech (12 products)
    const niceAlutechProducts: Product[] = [
        {
            id: 'nice-rb400',
            title: 'NICE RB400',
            subtitle: 'Базовый привод для откатных ворот',
            badgeText: 'Популярный',
            badgeStyle: 'bg-slate-900',
            specs: ['До 400 кг', '24В питание', '2 пульта'],
            price: 'от 1150 BYN',
            productActionKey: 'nice-rb400',
            image: '/automation-sliding/ROBUS400.jpg',
            description: 'Привод NICE RB400 предназначен для откатных ворот весом до 400 кг. Оснащен надежным 24В двигателем с функцией аварийного разблокирования. Включает 2 пульта дистанционного управления. Поддерживает подключение оптических датчиков безопасности для дополнительной защиты.',
        },
        {
            id: 'nice-rb600',
            title: 'NICE RB600',
            subtitle: 'Усиленный привод',
            badgeText: 'Оптимальный',
            badgeStyle: 'bg-zinc-700',
            specs: ['До 600 кг', '24В питание', '2 пульта'],
            price: 'от 1235 BYN',
            productActionKey: 'nice-rb600',
            image: '/automation-sliding/ROBUS400.jpg',
            description: 'Привод NICE RB600 разработан для откатных ворот весом до 600 кг. Мощный 24В двигатель обеспечивает плавную работу. Включает 2 пульта дистанционного управления. Поддерживает интеграцию с системами безопасности.',
        },
        {
            id: 'nice-rb1000',
            title: 'NICE RB1000',
            subtitle: 'Мощный привод',
            badgeText: 'Мощный',
            badgeStyle: 'bg-zinc-700',
            specs: ['До 1000 кг', '24В питание', '4 пульта'],
            price: 'от 1355 BYN',
            productActionKey: 'nice-rb1000',
            image: '/automation-sliding/ROBUS400.jpg',
            description: 'Привод NICE RB1000 предназначен для тяжелых откатных ворот весом до 1000 кг. Оснащен мощным 24В двигателем с аварийным разблокированием. Включает 4 пульта дистанционного управления. Поддерживает подключение промышленных систем безопасности.',
        },
        {
            id: 'nice-rd400',
            title: 'NICE RD400',
            subtitle: 'Компактный привод',
            badgeText: 'Компакт',
            badgeStyle: 'bg-zinc-700',
            specs: ['До 400 кг', '230В питание', '2 пульта'],
            price: 'от 760 BYN',
            productActionKey: 'nice-rd400',
            image: '/automation-sliding/road400.jpg',
            description: 'Компактный привод NICE RD400 для откатных ворот весом до 400 кг. Работает от сети 230В. Включает 2 пульта дистанционного управления. Идеален для установки в ограниченном пространстве.',
        },
        {
            id: 'nice-ro-600',
            title: 'NICE RO 600',
            subtitle: 'Надежный привод',
            badgeText: 'Надежный',
            badgeStyle: 'bg-zinc-700',
            specs: ['До 600 кг', '230В питание', '2 пульта'],
            price: 'от 955 BYN',
            productActionKey: 'nice-ro-600',
            image: '/automation-sliding/nice_ro_600.webp',
            description: 'Привод NICE RO 600 для откатных ворот весом до 600 кг. Работает от сети 230В. Включает 2 пульта дистанционного управления. Обеспечивает надежную работу в условиях интенсивной эксплуатации.',
        },
        {
            id: 'nice-rox1000',
            title: 'NICE ROX1000',
            subtitle: 'Тяжелые ворота',
            badgeText: 'Профессиональный',
            badgeStyle: 'bg-zinc-800',
            specs: ['До 1000 кг', '230В питание', '4 пульта'],
            price: 'от 1605 BYN',
            productActionKey: 'nice-rox1000',
            image: '/automation-sliding/nice_rox_1000.jpg',
            description: 'Профессиональный привод NICE ROX1000 для тяжелых откатных ворот весом до 1000 кг. Работает от сети 230В. Включает 4 пульта дистанционного управления. Поддерживает интеграцию с системами контроля доступа.',
        },
        {
            id: 'alutech-rto500kit',
            title: 'Алютех RTO500KIT',
            subtitle: 'Базовый комплект',
            badgeText: 'Народный выбор',
            badgeStyle: 'bg-[#E65F2B]',
            specs: ['До 500 кг', '24В питание', '2 пульта'],
            price: 'от 770 BYN',
            productActionKey: 'alutech-rto500kit',
            image: '/automation-sliding/alutech_rto_500_kit.jpg',
            description: 'Комплект привода Alutech RTO500KIT для откатных ворот весом до 500 кг. Оснащен безопасным 24В двигателем с аварийным разблокированием. Включает 2 пульта дистанционного управления. Полный комплект для монтажа.',
        },
        {
            id: 'alutech-rto500mkit',
            title: 'Алютех RTO500MKIT',
            subtitle: 'Комплект с мотором',
            badgeText: 'Популярный',
            badgeStyle: 'bg-slate-900',
            specs: ['До 500 кг', '24В питание', '2 пульта'],
            price: 'от 790 BYN',
            productActionKey: 'alutech-rto500mkit',
            image: '/automation-sliding/alutech_rto_2000_mkit.jpeg',
            description: 'Комплект привода Alutech RTO500MKIT с усиленным мотором для откатных ворот весом до 500 кг. Безопасный 24В двигатель с аварийным разблокированием. Включает 2 пульта дистанционного управления.',
        },
        {
            id: 'alutech-rto1000kit',
            title: 'Алютех RTO1000KIT',
            subtitle: 'Усиленный комплект',
            badgeText: 'Мощный',
            badgeStyle: 'bg-zinc-700',
            specs: ['До 1000 кг', '24В питание', '4 пульта'],
            price: 'от 870 BYN',
            productActionKey: 'alutech-rto1000kit',
            image: '/automation-sliding/alutech_rto_500_kit.jpg',
            description: 'Комплект привода Alutech RTO1000KIT для откатных ворот весом до 1000 кг. Мощный 24В двигатель с аварийным разблокированием. Включает 4 пульта дистанционного управления. Полный комплект для монтажа.',
        },
        {
            id: 'alutech-rto1000mkit',
            title: 'Алютех RTO1000MKIT',
            subtitle: 'Комплект с мотором',
            badgeText: 'Мощный',
            badgeStyle: 'bg-zinc-700',
            specs: ['До 1000 кг', '24В питание', '4 пульта'],
            price: 'от 895 BYN',
            productActionKey: 'alutech-rto1000mkit',
            image: '/automation-sliding/alutech_rto_2000_mkit.jpeg',
            description: 'Комплект привода Alutech RTO1000MKIT с усиленным мотором для откатных ворот весом до 1000 кг. Безопасный 24В двигатель с аварийным разблокированием. Включает 4 пульта дистанционного управления.',
        },
        {
            id: 'alutech-rto2000kit',
            title: 'Алютех RTO2000KIT',
            subtitle: 'Тяжелые ворота',
            badgeText: 'Профессиональный',
            badgeStyle: 'bg-zinc-800',
            specs: ['До 2000 кг', '24В питание', '4 пульта'],
            price: 'от 1105 BYN',
            productActionKey: 'alutech-rto2000kit',
            image: '/automation-sliding/alutech_rto_500_kit.jpg',
            description: 'Комплект привода Alutech RTO2000KIT для тяжелых откатных ворот весом до 2000 кг. Мощный 24В двигатель с аварийным разблокированием. Включает 4 пульта дистанционного управления. Полный комплект для промышленного монтажа.',
        },
        {
            id: 'alutech-rto2000mkit',
            title: 'Алютех RTO2000MKIT',
            subtitle: 'Максимальная мощность',
            badgeText: 'Премиум',
            badgeStyle: 'bg-black',
            specs: ['До 2000 кг', '24В питание', '4 пульта'],
            price: 'от 1135 BYN',
            productActionKey: 'alutech-rto2000mkit',
            image: '/automation-sliding/alutech_rto_2000_mkit.jpeg',
            description: 'Премиум комплект привода Alutech RTO2000MKIT с усиленным мотором для тяжелых откатных ворот весом до 2000 кг. Безопасный 24В двигатель с аварийным разблокированием. Включает 4 пульта дистанционного управления.',
        },
    ];

    // Tab 2: Высокоскоростные приводы (Hi-Speed) (3 products)
    const hispeedProducts: Product[] = [
        {
            id: 'nice-hispeed-rb500hskit',
            title: 'Высокоскоростной привод Nice Hi-Speed Rb500HSKIT',
            subtitle: 'Быстрое открытие',
            badgeText: 'Hi-Speed',
            badgeStyle: 'bg-[#E65F2B]',
            specs: ['До 500 кг', 'Высокая скорость', '2 пульта'],
            price: 'от 1400 BYN',
            productActionKey: 'nice-hispeed-rb500hskit',
            image: '/automation-sliding/nice_rb500hs.jpg',
            description: 'Высокоскоростной привод Nice Hi-Speed Rb500HSKIT обеспечивает быстрое открытие откатных ворот весом до 500 кг. Идеален для интенсивного использования. Включает 2 пульта дистанционного управления.',
        },
        {
            id: 'nice-hispeed-run1200hs',
            title: 'Высокоскоростной привод Nice Hi-Speed Run1200HS',
            subtitle: 'Максимальная скорость',
            badgeText: 'Премиум',
            badgeStyle: 'bg-black',
            specs: ['До 1200 кг', 'Высокая скорость', '4 пульта'],
            price: 'от 2775 BYN',
            productActionKey: 'nice-hispeed-run1200hs',
            image: '/automation-sliding/nice_run_1200hs.jpg',
            description: 'Высокоскоростной привод Nice Hi-Speed Run1200HS обеспечивает максимальную скорость открытия для тяжелых откатных ворот весом до 1200 кг. Включает 4 пульта дистанционного управления. Поддерживает интеграцию с системами контроля доступа.',
        },
        {
            id: 'nice-hispeed-rb250hs',
            title: 'Высокоскоростной привод Nice Hi-Speed Rb 250HS',
            subtitle: 'Компактный Hi-Speed',
            badgeText: 'Hi-Speed',
            badgeStyle: 'bg-[#E65F2B]',
            specs: ['До 250 кг', 'Высокая скорость', '2 пульта'],
            price: 'от 1320 BYN',
            productActionKey: 'nice-hispeed-rb250hs',
            image: '/automation-sliding/nice_robus250hs.jpg',
            description: 'Компактный высокоскоростной привод Nice Hi-Speed Rb 250HS для легких откатных ворот весом до 250 кг. Обеспечивает быстрое открытие при компактных размерах. Включает 2 пульта дистанционного управления.',
        },
    ];

    const processSteps: Step[] = [
        {
            icon: ClipboardCheck,
            time: '1-2 дня',
            title: 'Замер',
            description: 'Выезд специалиста для точных измерений проема и консультации по выбору оптимальной автоматики',
        },
        {
            icon: Wrench,
            time: '5-10 дней',
            title: 'Подготовка',
            description: 'Заказ и подготовка оборудования, комплектующих и материалов для монтажа',
        },
        {
            icon: Calendar,
            time: '1 день',
            title: 'Монтаж',
            description: 'Профессиональная установка автоматики с настройкой и обучением пользованию',
        },
        {
            icon: CreditCard,
            time: 'По факту',
            title: 'Оплата',
            description: 'Оплата после выполнения работ и проверки работоспособности системы',
        },
    ];

    return (
        <>
            {/* Hero Section */}
            <Section className="bg-zinc-950 lg:bg-transparent !pt-0 lg:!pt-12 pb-12 sm:pb-16 p-0 lg:p-default relative">
                <Container size="xl"
                           className="bg-zinc-950 lg:bg-transparent !pt-0 lg:!pt-0 px-0 lg:px-default relative w-full max-w-full">
                    <div className="w-full max-w-[1200px] mx-auto relative lg:px-6">
                        <div
                            className="relative -mx-4 px-6 py-8 sm:-mx-6 sm:p-8 lg:mx-0 lg:p-0 rounded-none sm:rounded-2xl lg:bg-transparent grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center lg:max-h-[500px] text-white lg:text-gray-900 bg-white">

                            {/* Mobile backdrop image */}
                            <img
                                src="/automation-sliding/automation_sliding2.jpeg"
                                className="absolute inset-0 object-cover opacity-60 max-lg:block hidden z-0 pointer-events-none sm:rounded-2xl"
                                style={{width: '100%', height: '100%'}}
                                alt="Sliding Gate Automation Mobile Backdrop"
                            />

                            {/* Gradient overlay */}
                            <div
                                className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/10 max-lg:block hidden z-10 pointer-events-none sm:rounded-2xl"/>

                            {/* Left Column */}
                            <div className="flex flex-col justify-center h-auto py-4 lg:py-0 relative z-20">
                                {/* Breadcrumbs */}
                                <nav
                                    className="flex flex-wrap items-center gap-1 text-xs sm:text-sm whitespace-nowrap overflow-x-auto scrollbar-none max-w-full text-gray-300 lg:text-gray-500 mb-6">
                                    <Link href="/" className="hover:text-[#E65F2B] transition-colors">
                                        Главная
                                    </Link>
                                    <span>/</span>
                                    <Link href="/catalog" className="hover:text-[#E65F2B] transition-colors">
                                        Каталог
                                    </Link>
                                    <span>/</span>
                                    <span className="text-white lg:text-slate-900">Автоматика для откатных ворот</span>
                                </nav>

                                {/* Title */}
                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white lg:text-slate-900 mb-6 leading-tight">
                                    Автоматика для откатных ворот
                                </h1>

                                {/* Subtitle */}
                                <p className="text-lg text-gray-200 lg:text-gray-600 mb-8 leading-relaxed">
                                    Надежные приводы для откатных ворот от ведущих производителей NICE и Alutech. Официальный дилер. 
                                    Профессиональный монтаж с гарантией.
                                </p>

                                {/* CTA Button */}
                                <Button size="lg" className="w-fit cta-button-primary" data-action="calculate-cost">
                                    Подобрать привод под мои ворота
                                    <ArrowRight className="ml-2 w-5 h-5"/>
                                </Button>

                                {/* Trust Badges */}
                                <div className="flex flex-wrap gap-6 mt-8">
                                    <div className="flex items-center gap-2 text-sm text-gray-200 lg:text-gray-600">
                                        <Check className="w-5 h-5 text-[#E65F2B]"/>
                                        <span>Официальный дилер NICE и Alutech</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-200 lg:text-gray-600">
                                        <Check className="w-5 h-5 text-[#E65F2B]"/>
                                        <span>Помощь в подборе под любые ворота</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-200 lg:text-gray-600">
                                        <Check className="w-5 h-5 text-[#E65F2B]"/>
                                        <span>Гарантия на приводы и монтаж</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Product Image */}
                            <div className="hidden lg:block w-full h-full max-h-[500px] relative overflow-hidden rounded-2xl z-20">
                                <img
                                    src="/automation-sliding/automation_sliding2.jpeg"
                                    alt="Автоматика для откатных ворот"
                                    className="absolute inset-0 w-full h-full object-cover object-center"
                                />
                            </div>

                        </div>
                    </div>
                </Container>
            </Section>

            {/* Product Catalog with Tabs */}
            <Section background="muted" className="py-8 lg:py-16">
                <Container background="muted">
                    <div className="text-center max-w-3xl mx-auto px-4 mt-6 mb-4 lg:mt-16 lg:mb-8">
                        <h2
                            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2F3E46] mb-4"
                            style={{ fontFamily: 'var(--font-montserrat)' }}
                        >
                            Каталог автоматики
                        </h2>
                        <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                            Выберите категорию оборудования для откатных ворот
                        </p>
                    </div>

                    {/* Tab Navigation */}
                    <div className="w-full max-w-[900px] mx-auto bg-zinc-100/80 p-1.5 rounded-2xl flex items-center justify-between relative select-none border border-zinc-200/30 mt-2 mb-4 lg:mt-6 lg:mb-8">
                        <button
                            onClick={() => setActiveTab('nice-alutech')}
                            className={`flex-1 text-center py-2.5 px-3 text-xs sm:text-sm font-bold rounded-xl transition-all duration-300 relative z-10 whitespace-normal leading-tight ${
                                activeTab === 'nice-alutech' ? 'bg-white text-[#E65F2B] shadow-sm' : 'text-gray-500 hover:text-gray-900'
                            }`}
                        >
                            Приводы NICE & Alutech
                        </button>
                        <button
                            onClick={() => setActiveTab('hispeed')}
                            className={`flex-1 text-center py-2.5 px-3 text-xs sm:text-sm font-bold rounded-xl transition-all duration-300 relative z-10 whitespace-normal leading-tight ${
                                activeTab === 'hispeed' ? 'bg-white text-[#E65F2B] shadow-sm' : 'text-gray-500 hover:text-gray-900'
                            }`}
                        >
                            Высокоскоростные приводы (Hi-Speed)
                        </button>
                    </div>

                    {/* Tab Content */}
                    {activeTab === 'nice-alutech' && (
                        <>
                            <h3 className="text-2xl font-bold text-[#2F3E46] mb-2 text-center">Приводы NICE & Alutech</h3>
                            <p className="text-gray-600 text-center mb-6">Надежные приводы для откатных ворот различной грузоподъемности</p>
                            <ProductGrid products={niceAlutechProducts} onProductClick={setSelectedProduct} />
                        </>
                    )}
                    {activeTab === 'hispeed' && (
                        <>
                            <h3 className="text-2xl font-bold text-[#2F3E46] mb-2 text-center">Высокоскоростные приводы (Hi-Speed)</h3>
                            <p className="text-gray-600 text-center mb-6">Приводы с повышенной скоростью открытия для интенсивного использования</p>
                            <ProductGrid products={hispeedProducts} onProductClick={setSelectedProduct} />
                        </>
                    )}
                </Container>
            </Section>

            {/* Stages Block */}
            <Section background="white" className="py-8 lg:py-20">
                <Container background="white">
                    <div className="text-center max-w-3xl mx-auto px-4 mt-6 mb-12 lg:mt-16 lg:mb-12">
                        <h2
                            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2F3E46] mb-4"
                            style={{ fontFamily: 'var(--font-montserrat)' }}
                        >
                            ЭТАПЫ ОТ ЗВОНКА ДО РЕЗУЛЬТАТА
                        </h2>
                        <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                            Простой и прозрачный процесс установки автоматики
                        </p>
                    </div>

                    <ProcessMap steps={processSteps} />
                </Container>
            </Section>

            {/* CTA Section */}
            <Section background="muted" className="py-8 lg:py-20">
                <Container background="muted">
                    <div className="max-w-3xl mx-auto text-center mt-6 mb-4 lg:mt-16 lg:mb-8">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2F3E46] mb-6">
                            Готовы заказать автоматику для откатных ворот?
                        </h2>
                        <p className="text-lg text-gray-600 mb-8">
                            Получить консультацию по выбору →
                        </p>
                        <Button size="lg" className="cta-button-primary" data-action="measurement-request">
                            Получить консультацию по выбору
                            <ArrowRight className="ml-2 w-5 h-5"/>
                        </Button>
                    </div>
                </Container>
            </Section>

            {/* Product Detail Modal */}
            {selectedProduct && (
                <div
                    className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
                    onClick={handleClose}
                >
                    {/* Desktop Modal */}
                    <div
                        className={`hidden md:flex rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden transition-all duration-300 ease-out ${isClosing || !isMounted ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="w-1/2 bg-white rounded-l-2xl flex items-center justify-center p-8">
                            <img
                                src={selectedProduct.image}
                                alt={selectedProduct.title}
                                className="w-full h-full object-contain max-h-[500px]"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                }}
                            />
                        </div>
                        <div className="w-1/2 bg-slate-50 rounded-r-2xl p-8 flex flex-col overflow-y-auto">
                            <button
                                onClick={handleClose}
                                className="self-end mb-4 p-2 hover:bg-slate-100 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6 text-gray-500" />
                            </button>
                            <span
                                className={`px-3 py-1 ${selectedProduct.badgeStyle} text-white text-sm font-semibold rounded-full w-fit mb-4`}
                            >
                                {selectedProduct.badgeText}
                            </span>
                            <h2 className="text-2xl font-bold text-[#2F3E46] mb-2">{selectedProduct.title}</h2>
                            <p className="text-gray-500 mb-4">{selectedProduct.subtitle}</p>
                            
                            {selectedProduct.description && (
                                <div className="text-slate-600 text-sm md:text-base leading-relaxed mb-6">
                                    {selectedProduct.description}
                                </div>
                            )}

                            <div className="space-y-2 mb-6">
                                {selectedProduct.specs.map((spec, idx) => (
                                    <div key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full flex-shrink-0"/>
                                        <span>{spec}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-auto">
                                <div className="mb-4">
                                    <div className="text-2xl font-bold text-[#E65F2B]">{selectedProduct.price}</div>
                                </div>
                                <Button
                                    size="lg"
                                    className="w-full cta-button-primary"
                                    data-action="measurement-request"
                                    data-product={selectedProduct.productActionKey}
                                >
                                    ЗАКАЗАТЬ
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Bottom Sheet */}
                    <div
                        className={`md:hidden fixed bottom-0 inset-x-0 bg-white rounded-t-2xl max-h-[85vh] overflow-y-auto p-5 z-50 transition-transform duration-300 ease-in-out ${isClosing || !isMounted ? 'translate-y-full' : 'translate-y-0'}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Drag Handle */}
                        <div className="flex justify-center mb-4">
                            <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
                        </div>

                        {/* Product Image */}
                        <div className="w-full aspect-square bg-slate-50 flex items-center justify-center p-4 rounded-xl mb-4">
                            <img
                                src={selectedProduct.image}
                                alt={selectedProduct.title}
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                }}
                            />
                        </div>

                        {/* Product Info */}
                        <span
                            className={`px-3 py-1 ${selectedProduct.badgeStyle} text-white text-xs font-semibold rounded-full w-fit mb-3`}
                        >
                            {selectedProduct.badgeText}
                        </span>
                        <h2 className="text-xl font-bold text-[#2F3E46] mb-1">{selectedProduct.title}</h2>
                        <p className="text-sm text-gray-500 mb-4">{selectedProduct.subtitle}</p>
                        
                        {selectedProduct.description && (
                            <div className="text-slate-600 text-sm leading-relaxed mb-4">
                                {selectedProduct.description}
                            </div>
                        )}

                        <div className="space-y-2 mb-4">
                            {selectedProduct.specs.map((spec, idx) => (
                                <div key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full flex-shrink-0"/>
                                    <span>{spec}</span>
                                </div>
                            ))}
                        </div>

                        {/* Price and CTA */}
                        <div className="mb-4 pt-4 border-t border-gray-100">
                            <div className="text-xl font-bold text-[#E65F2B]">{selectedProduct.price}</div>
                        </div>
                        <Button
                            size="lg"
                            className="w-full cta-button-primary"
                            data-action="measurement-request"
                            data-product={selectedProduct.productActionKey}
                        >
                            ЗАКАЗАТЬ
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
}
