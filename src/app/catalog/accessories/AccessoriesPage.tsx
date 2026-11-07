'use client';

import {useState, useEffect} from 'react';
import Link from 'next/link';
import {ArrowRight, Check, Calendar, Wrench, CreditCard, ClipboardCheck, X} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Section} from '@/components/ui/section';
import {Container} from '@/components/ui/container';
import ProcessMap, {Step} from '@/components/features/process-map';
import { useFeedbackModal } from '@/contexts/FeedbackModalContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';

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
    const { addToCart } = useCart();
    const { showToast } = useToast();

    const handleAddToCart = (e: React.MouseEvent, product: Product) => {
        e.stopPropagation();
        addToCart({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            category: product.subtitle,
        });
        showToast('Товар добавлен в корзину', product.title);
    };
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
                            className="w-full text-xs bg-[#E65F2B] hover:bg-[#d5541e] text-white font-semibold rounded-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
                            onClick={(e) => handleAddToCart(e, product)}
                        >
                            В корзину
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function AccessoriesPage() {
    const { openModal } = useFeedbackModal();
    const [activeTab, setActiveTab] = useState<'remotes' | 'safety' | 'smart'>('remotes');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    // Handle escape key to close modal
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && selectedProduct && !isClosing){
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

    // Tab 1: Пульты управления (4 products)
    const remoteProducts: Product[] = [
        {
            id: 'at-4',
            title: 'пульт д/у АТ-4, AT-4N',
            subtitle: 'Универсальный пульт',
            badgeText: 'Популярный',
            badgeStyle: 'bg-slate-900',
            specs: ['4 канала', '433 МГц', 'Совместимость с AN-Motors'],
            price: 'от 45 BYN',
            productActionKey: 'at-4',
            image: '/accessories/webp/alutech_at4n.webp',
            description: 'Универсальный пульт дистанционного управления АТ-4/AT-4N с 4 каналами на частоте 433 МГц. Полностью совместим с автоматикой AN-Motors. Простое программирование.',
        },
        {
            id: 'flo2r-s',
            title: 'пульт д/у Flo2R-S',
            subtitle: 'Пульт для NICE',
            badgeText: 'Оптимальный',
            badgeStyle: 'bg-zinc-700',
            specs: ['2 канала', '433 МГц', 'Совместимость с NICE'],
            price: 'от 75 BYN',
            productActionKey: 'flo2r-s',
            image: '/accessories/webp/nice_flor2s.webp',
            description: 'Пульт дистанционного управления Flo2R-S с 2 каналами на частоте 433 МГц. Предназначен для работы с автоматикой NICE. Надежная передача сигнала.',
        },
        {
            id: 'flo2re',
            title: 'пульт д/у Flo2RE',
            subtitle: 'Пульт с расширенным диапазоном',
            badgeText: 'Мощный',
            badgeStyle: 'bg-zinc-700',
            specs: ['2 канала', '433 МГц', 'Улучшенный радиус'],
            price: 'от 100 BYN',
            productActionKey: 'flo2re',
            image: '/accessories/webp/nice_flor2e.webp',
            description: 'Пульт дистанционного управления Flo2RE с расширенным радиусом действия. 2 канала на частоте 433 МГц для работы с автоматикой NICE.',
        },
        {
            id: 'ar-1-500',
            title: 'AR-1-500 AN-Motors радиоприемник',
            subtitle: 'Универсальный радиоприемник',
            badgeText: 'Профессиональный',
            badgeStyle: 'bg-zinc-800',
            specs: ['На 500 пультов', 'Универсальный', '433 МГц'],
            price: 'от 68 BYN',
            productActionKey: 'ar-1-500',
            image: '/accessories/webp/an_motors_ar_1_500.webp',
            description: 'Универсальный радиоприемник AR-1-500 от AN-Motors для подключения до 500 пультов. Работает на частоте 433 МГц. Совместим с большинством систем автоматики.',
        },
    ];

    // Tab 2: Элементы безопасности (5 products)
    const safetyProducts: Product[] = [
        {
            id: 'nice-epm',
            title: 'Фотоэлементы NICE, EPM, EPMB',
            subtitle: 'Оптические датчики безопасности',
            badgeText: 'Надежный',
            badgeStyle: 'bg-slate-900',
            specs: ['Инфракрасные', 'Для NICE', 'Высокая точность'],
            price: 'от 290 BYN',
            productActionKey: 'nice-epm',
            image: '/accessories/webp/nice_epm.webp',
            description: 'Фотоэлементы NICE серии EPM/EPMB для обеспечения безопасности автоматики. Инфракрасные датчики с высокой точностью обнаружения препятствий.',
        },
        {
            id: 'alutech-lm-l',
            title: 'Фотоэлементы Алютех, LM-L',
            subtitle: 'Базовые датчики безопасности',
            badgeText: 'Популярный',
            badgeStyle: 'bg-slate-900',
            specs: ['Инфракрасные', 'Для Alutech', 'Компактные'],
            price: 'от 77 BYN',
            productActionKey: 'alutech-lm-l',
            image: '/accessories/webp/alutech_lm_l.webp',
            description: 'Фотоэлементы Alutech серии LM-L для базовой системы безопасности. Компактные инфракрасные датчики для автоматических ворот.',
        },
        {
            id: 'alutech-lm-lb',
            title: 'Фотоэлементы Алютех, LM-LB',
            subtitle: 'Усиленные датчики безопасности',
            badgeText: 'Оптимальный',
            badgeStyle: 'bg-zinc-700',
            specs: ['Инфракрасные', 'Для Alutech', 'Расширенный диапазон'],
            price: 'от 132 BYN',
            productActionKey: 'alutech-lm-lb',
            image: '/accessories/webp/alutech_lm_lb.jxl',
            description: 'Фотоэлементы Alutech серии LM-LB с расширенным диапазоном действия. Усиленные инфракрасные датчики для повышенной безопасности.',
        },
        {
            id: 'lamp-el',
            title: 'Сигнальная лампа EL',
            subtitle: 'Предупреждающая сигнализация',
            badgeText: 'Безопасный',
            badgeStyle: 'bg-zinc-700',
            specs: ['LED', '220В', 'Визуальная сигнализация'],
            price: 'от 130 BYN',
            productActionKey: 'lamp-el',
            image: '/accessories/webp/nice_el.webp',
            description: 'Сигнальная лампа EL для визуального оповещения о работе автоматики. Яркий LED индикатор на 220В для повышения безопасности.',
        },
        {
            id: 'lamp-sl-u',
            title: 'Сигнальная лампа SL-U',
            subtitle: 'Компактная сигнализация',
            badgeText: 'Компакт',
            badgeStyle: 'bg-zinc-700',
            specs: ['LED', '24В', 'Компактная'],
            price: 'от 75 BYN',
            productActionKey: 'lamp-sl-u',
            image: '/accessories/webp/alutech_sl_u.webp',
            description: 'Компактная сигнальная лампа SL-U для систем безопасности на 24В. LED индикатор для визуального оповещения о работе ворот.',
        },
    ];

    // Tab 3: Умные модули (1 product)
    const smartProducts: Product[] = [
        {
            id: 'sg303ga-wr',
            title: '3/4G GSM-модуль SG303GA-WR',
            subtitle: 'Умное управление воротами',
            badgeText: 'Smart',
            badgeStyle: 'bg-[#E65F2B]',
            specs: ['3G/4G', 'Управление со смартфона', 'SMS уведомления'],
            price: 'от 1370 BYN',
            productActionKey: 'sg303ga-wr',
            image: '/accessories/webp/gsm_sg303ga_wr.webp',
            description: 'GSM-модуль SG303GA-WR с поддержкой 3G/4G для удаленного управления воротами со смартфона. Отправка SMS уведомлений о статусе ворот. Совместим с большинством систем автоматики.',
        },
    ];

    const processSteps: Step[] = [
        {
            icon: ClipboardCheck,
            time: '1-2 дня',
            title: 'Замер',
            description: 'Консультация по выбору аксессуаров и проверка совместимости с вашей автоматикой',
        },
        {
            icon: Wrench,
            time: '1-3 дня',
            title: 'Доставка',
            description: 'Доставка выбранных аксессуаров или самовывоз из нашего офиса',
        },
        {
            icon: Calendar,
            time: '1 день',
            title: 'Настройка',
            description: 'Программирование пультов, установка датчиков и настройка GSM-модулей',
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
                            className="relative -mx-4 px-6 py-8 sm:-mx-6 sm:p-8 lg:mx-0 lg:p-0 rounded-none sm:rounded-2xl lg:bg-transparent grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-white lg:text-gray-900">

                            {/* Mobile backdrop image */}
                            <img
                                src="/accessories/webp/accessories_mobile_background.webp"
                                className="absolute inset-0 object-cover opacity-60 max-lg:block hidden z-0 pointer-events-none sm:rounded-2xl"
                                style={{width: '100%', height: '100%'}}
                                alt="Accessories Mobile Backdrop"
                            />

                            {/* Gradient overlay */}
                            <div
                                className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/10 max-lg:block hidden z-10 pointer-events-none sm:rounded-2xl"/>

                            {/* Left Column */}
                            <div className="flex flex-col justify-center py-4 lg:py-0 relative z-20">
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
                                    <span className="text-white lg:text-slate-900">Аксессуары</span>
                                </nav>

                                {/* Title */}
                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white lg:text-slate-900 mb-6 leading-tight">
                                    Аксессуары для автоматики и шлагбаумов
                                </h1>

                                {/* Subtitle */}
                                <p className="text-lg text-gray-200 lg:text-gray-600 mb-8 leading-relaxed">
                                    Управляйте воротами не выходя из автомобиля и обеспечьте максимальную безопасность вашей семьи и автомобиля. Поможем подобрать пульты, датчики и GSM-модули под автоматику любого бренда с 100% гарантией совместимости.
                                </p>

                                {/* CTA Button */}
                                <Button 
                                    size="lg" 
                                    className="w-fit cta-button-primary" 
                                    onClick={() => openModal({
                                        scope: 'consultation',
                                        title: 'Подобрать аксессуары',
                                        subtitle: 'Поможем подобрать пульты, датчики и GSM-модули под вашу автоматику',
                                    })}
                                >
                                    Подобрать аксессуары
                                    <ArrowRight className="ml-2 w-5 h-5"/>
                                </Button>

                                {/* Trust Badges */}
                                <div className="flex flex-wrap gap-6 mt-8">
                                    <div className="flex items-center gap-2 text-sm text-gray-200 lg:text-gray-600">
                                        <Check className="w-5 h-5 text-[#E65F2B]"/>
                                        <span>В наличии оригиналы NICE, Alutech, AN-Motors</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-200 lg:text-gray-600">
                                        <Check className="w-5 h-5 text-[#E65F2B]"/>
                                        <span>Универсальные решения для любых приводов</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-200 lg:text-gray-600">
                                        <Check className="w-5 h-5 text-[#E65F2B]"/>
                                        <span>Помощь в программировании и настройке</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Product Image */}
                            <div className="hidden lg:block w-full flex items-center justify-center p-4 relative z-20">
                                <img
                                    src="/accessories/webp/accessories_mobile_background.webp"
                                    alt="Аксессуары для автоматики и шлагбаумов"
                                    className="w-full max-w-[480px] h-auto object-contain rounded-2xl"
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
                            Каталог аксессуаров
                        </h2>
                        <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                            Выберите категорию аксессуаров для вашей автоматики
                        </p>
                    </div>

                    {/* Tab Navigation */}
                    <div className="w-full max-w-[900px] mx-auto bg-zinc-100/80 p-1.5 rounded-2xl flex items-center justify-between relative select-none border border-zinc-200/30 mt-2 mb-4 lg:mt-6 lg:mb-8">
                        <button
                            onClick={() => setActiveTab('remotes')}
                            className={`flex-1 text-center py-2.5 px-3 text-xs sm:text-sm font-bold rounded-xl transition-all duration-300 relative z-10 whitespace-normal leading-tight ${
                                activeTab === 'remotes' ? 'bg-white text-[#E65F2B] shadow-sm' : 'text-gray-500 hover:text-gray-900'
                            }`}
                        >
                            Пульты управления
                        </button>
                        <button
                            onClick={() => setActiveTab('safety')}
                            className={`flex-1 text-center py-2.5 px-3 text-xs sm:text-sm font-bold rounded-xl transition-all duration-300 relative z-10 whitespace-normal leading-tight ${
                                activeTab === 'safety' ? 'bg-white text-[#E65F2B] shadow-sm' : 'text-gray-500 hover:text-gray-900'
                            }`}
                        >
                            Элементы безопасности
                        </button>
                        <button
                            onClick={() => setActiveTab('smart')}
                            className={`flex-1 text-center py-2.5 px-3 text-xs sm:text-sm font-bold rounded-xl transition-all duration-300 relative z-10 whitespace-normal leading-tight ${
                                activeTab === 'smart' ? 'bg-white text-[#E65F2B] shadow-sm' : 'text-gray-500 hover:text-gray-900'
                            }`}
                        >
                            Умные модули
                        </button>
                    </div>

                    {/* Tab Content */}
                    {activeTab === 'remotes' && (
                        <>
                            <h3 className="text-2xl font-bold text-[#2F3E46] mb-2 text-center">Пульты управления</h3>
                            <p className="text-gray-600 text-center mb-6">Универсальные пульты для автоматики различных брендов</p>
                            <ProductGrid products={remoteProducts} onProductClick={setSelectedProduct} />
                        </>
                    )}
                    {activeTab === 'safety' && (
                        <>
                            <h3 className="text-2xl font-bold text-[#2F3E46] mb-2 text-center">Элементы безопасности</h3>
                            <p className="text-gray-600 text-center mb-6">Фотоэлементы и сигнальные лампы для защиты людей и техники</p>
                            <ProductGrid products={safetyProducts} onProductClick={setSelectedProduct} />
                        </>
                    )}
                    {activeTab === 'smart' && (
                        <>
                            <h3 className="text-2xl font-bold text-[#2F3E46] mb-2 text-center">Умные модули</h3>
                            <p className="text-gray-600 text-center mb-6">GSM-модули для удаленного управления воротами</p>
                            <ProductGrid products={smartProducts} onProductClick={setSelectedProduct} />
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
                            Простой и прозрачный процесс подбора и настройки аксессуаров
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
                            Нужна помощь в выборе или программировании аксессуаров?
                        </h2>
                        <p className="text-lg text-gray-600 mb-8">
                            Получите бесплатную консультацию от специалиста по подбору и настройке аксессуаров под вашу автоматику
                        </p>
                        <Button 
                            size="lg" 
                            className="cta-button-primary" 
                            onClick={() => openModal({
                                scope: 'consultation',
                                title: 'Консультация по аксессуарам',
                                subtitle: 'Получите бесплатную консультацию по подбору и настройке аксессуаров',
                            })}
                        >
                            Получить бесплатную консультацию
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
                                    onClick={() => openModal({
                                        scope: 'product',
                                        productInfo: {
                                            name: selectedProduct.title,
                                            brand: selectedProduct.subtitle,
                                            price: selectedProduct.price,
                                            specs: selectedProduct.specs,
                                        },
                                    })}
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
                            onClick={() => openModal({
                                scope: 'product',
                                productInfo: {
                                    name: selectedProduct.title,
                                    brand: selectedProduct.subtitle,
                                    price: selectedProduct.price,
                                    specs: selectedProduct.specs,
                                },
                            })}
                        >
                            ЗАКАЗАТЬ
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
}
