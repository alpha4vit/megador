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
                        <img draggable={false}
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

export default function AutomationSwingPage() {
    const { openModal } = useFeedbackModal();
    const [activeTab, setActiveTab] = useState<'nice' | 'alutech'>('nice');
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

    // Tab 1: Автоматика NICE (7 products)
    const niceProducts: Product[] = [
        {
            id: 'nice-wingo-3524-kce',
            title: 'Nice Wingo 3524 KCE',
            subtitle: 'Базовая комплектация',
            badgeText: 'Популярный',
            badgeStyle: 'bg-slate-900',
            specs: ['Блок д/у', '2 пульта д/у', 'Для легких ворот'],
            price: 'от 1880 BYN',
            productActionKey: 'nice-wingo-3524-kce',
            image: '/automation-swing/webp/wingo2024kce_2.webp',
            description: 'Комплект Nice Wingo 3524 KCE включает блок управления и 2 пульта дистанционного управления. Предназначен для автоматизации распашных ворот с легким весом. Обеспечивает надежную и плавную работу механизма.',
        },
        {
            id: 'nice-wingo-3524kit1',
            title: 'Nice Wingo 3524KIT1',
            subtitle: 'Расширенная комплектация',
            badgeText: 'Оптимальный',
            badgeStyle: 'bg-zinc-700',
            specs: ['Блок д/у', '2 пульта', 'Линия фотоэлементов'],
            price: 'от 2050 BYN',
            productActionKey: 'nice-wingo-3524kit1',
            image: '/automation-swing/webp/wingo2024kce_2.webp',
            description: 'Комплект Nice Wingo 3524KIT1 оснащен блоком управления, 2 пультами и линией фотоэлементов для дополнительной безопасности. Обеспечивает автоматическую остановку при обнаружении препятствий.',
        },
        {
            id: 'nice-too3000-klt',
            title: 'Nice TOO3000 KLT',
            subtitle: 'Универсальный привод',
            badgeText: 'Народный выбор',
            badgeStyle: 'bg-[#E65F2B]',
            specs: ['Блок д/у', '2 пульта д/у', 'Универсальный'],
            price: 'от 1700 BYN',
            productActionKey: 'nice-too3000-klt',
            image: '/automation-swing/webp/nice_to3000klt.webp',
            description: 'Привод Nice TOO3000 KLT с блоком управления и 2 пультами. Универсальное решение для автоматизации распашных ворот различных размеров. Простая установка и настройка.',
        },
        {
            id: 'nice-to4016r-kit',
            title: 'Nice TO4016Р KIT',
            subtitle: 'Усиленный привод',
            badgeText: 'Популярный',
            badgeStyle: 'bg-slate-900',
            specs: ['Блок д/у', '2 пульта д/у', 'Усиленный'],
            price: 'от 2120 BYN',
            productActionKey: 'nice-to4016r-kit',
            image: '/automation-swing/webp/nice_to4016p.webp',
            description: 'Комплект Nice TO4016Р KIT с усиленным приводом, блоком управления и 2 пультами. Предназначен для распашных ворот с повышенным весом. Обеспечивает надежную работу при интенсивной эксплуатации.',
        },
        {
            id: 'nice-to4016kit1',
            title: 'Nice TO4016KIT1',
            subtitle: 'Максимальная безопасность',
            badgeText: 'Безопасный',
            badgeStyle: 'bg-zinc-700',
            specs: ['Блок д/у', '2 пульта', 'Линия фотоэлементов'],
            price: 'от 2250 BYN',
            productActionKey: 'nice-to4016kit1',
            image: '/automation-swing/webp/nice_to4016p.webp',
            description: 'Комплект Nice TO4016KIT1 включает блок управления, 2 пульта и линию фотоэлементов. Обеспечивает максимальный уровень безопасности благодаря системе обнаружения препятствий.',
        },
        {
            id: 'nice-to5016r-kit',
            title: 'Nice TO5016Р KIT',
            subtitle: 'Мощный привод',
            badgeText: 'Мощный',
            badgeStyle: 'bg-zinc-700',
            specs: ['Блок д/у', '2 пульта д/у', 'Мощный'],
            price: 'от 2130 BYN',
            productActionKey: 'nice-to5016r-kit',
            image: '/automation-swing/webp/nice_5016p.webp',
            description: 'Мощный привод Nice TO5016Р KIT с блоком управления и 2 пультами. Предназначен для тяжелых распашных ворот. Гарантирует плавную и надежную работу механизма.',
        },
        {
            id: 'nice-hy7005kit',
            title: 'Nice HY7005KIT',
            subtitle: 'Гидравлический привод',
            badgeText: 'Премиум',
            badgeStyle: 'bg-black',
            specs: ['Блок д/у', '2 пульта д/у', 'Гидравлический'],
            price: 'от 2510 BYN',
            productActionKey: 'nice-hy7005kit',
            image: '/automation-swing/webp/nice_hy7005.webp',
            description: 'Гидравлический привод Nice HY7005KIT с блоком управления и 2 пультами. Премиальное решение для автоматизации тяжелых распашных ворот. Обеспечивает плавную работу и длительный срок службы.',
        },
    ];

    // Tab 2: Автоматика Alutech (2 products)
    const alutechProducts: Product[] = [
        {
            id: 'alutech-am-5000kit',
            title: 'Алютех AM-5000KIT',
            subtitle: 'Линейный привод',
            badgeText: 'Популярный',
            badgeStyle: 'bg-slate-900',
            specs: ['Привод линейный - 2 шт', 'Б/у (CUSD-1)', 'Надежный'],
            price: 'от 1430 BYN',
            productActionKey: 'alutech-am-5000kit',
            image: '/automation-swing/webp/alutech_am5000.webp',
            description: 'Комплект Алютех AM-5000KIT включает 2 линейных привода и блок управления CUSD-1. Предназначен для автоматизации распашных ворот. Обеспечивает надежную и плавную работу механизма.',
        },
        {
            id: 'alutech-asw-4000kit',
            title: 'Алютех ASW-4000KIT',
            subtitle: 'Рычажный привод',
            badgeText: 'Оптимальный',
            badgeStyle: 'bg-zinc-700',
            specs: ['Привод рычажный - 2 шт', 'Б/у (CUSD-1)', 'Компактный'],
            price: 'от 1440 BYN',
            productActionKey: 'alutech-asw-4000kit',
            image: '/automation-swing/webp/alutech_asw4000.webp',
            description: 'Комплект Алютех ASW-4000KIT оснащен 2 рычажными приводами и блоком управления CUSD-1. Компактное решение для автоматизации распашных ворот с ограниченным пространством.',
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
                            className="relative -mx-4 px-6 py-8 sm:-mx-6 sm:p-8 lg:mx-0 lg:p-0 rounded-none sm:rounded-2xl lg:bg-transparent md:grid-cols-2 items-center md:h-[500px] md:max-h-[500px] grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch text-white lg:text-gray-900 bg-white">

                            {/* Mobile backdrop image */}
                            <img draggable={false}
                                src="/automation-swing/webp/automation_swing.webp"
                                className="absolute inset-0 object-cover opacity-60 max-lg:block hidden z-0 pointer-events-none sm:rounded-2xl"
                                style={{width: '100%', height: '100%'}}
                                alt="Swing Gate Automation Mobile Backdrop"
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
                                    <span className="text-white lg:text-slate-900">Автоматика для распашных ворот</span>
                                </nav>

                                {/* Title */}
                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white lg:text-slate-900 mb-6 leading-tight">
                                    Автоматика для распашных ворот
                                </h1>

                                {/* Subtitle */}
                                <p className="text-lg text-gray-200 lg:text-gray-600 mb-8 leading-relaxed">
                                    Экспертный подбор автоматики для распашных ворот. Официальный дилер NICE и Alutech. 
                                    Профессиональный монтаж с гарантией.
                                </p>

                                {/* CTA Button */}
                                <Button 
                                    size="lg" 
                                    className="w-fit cta-button-primary" 
                                    onClick={() => openModal({
                                        scope: 'consultation',
                                        title: 'Подобрать привод',
                                        subtitle: 'Наш специалист поможет подобрать идеальный привод под параметры ваших ворот',
                                    })}
                                >
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
                            <div className="hidden lg:block w-full h-full relative z-20">
                                <img draggable={false}
                                    src="/automation-swing/webp/automation_swing.webp"
                                    alt="Автоматика для распашных ворот"
                                    className="w-full h-full object-cover object-center rounded-2xl"
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
                            Выберите бренд оборудования для распашных ворот
                        </p>
                    </div>

                    {/* Tab Navigation */}
                    <div className="w-full max-w-[900px] mx-auto bg-zinc-100/80 p-1.5 rounded-2xl flex items-center justify-between relative select-none border border-zinc-200/30 mt-2 mb-4 lg:mt-6 lg:mb-8">
                        <button
                            onClick={() => setActiveTab('nice')}
                            className={`flex-1 text-center py-2.5 px-3 text-xs sm:text-sm font-bold rounded-xl transition-all duration-300 relative z-10 whitespace-normal leading-tight ${
                                activeTab === 'nice' ? 'bg-white text-[#E65F2B] shadow-sm' : 'text-gray-500 hover:text-gray-900'
                            }`}
                        >
                            Автоматика NICE
                        </button>
                        <button
                            onClick={() => setActiveTab('alutech')}
                            className={`flex-1 text-center py-2.5 px-3 text-xs sm:text-sm font-bold rounded-xl transition-all duration-300 relative z-10 whitespace-normal leading-tight ${
                                activeTab === 'alutech' ? 'bg-white text-[#E65F2B] shadow-sm' : 'text-gray-500 hover:text-gray-900'
                            }`}
                        >
                            Автоматика Alutech
                        </button>
                    </div>

                    {/* Tab Content */}
                    {activeTab === 'nice' && (
                        <>
                            <h3 className="text-2xl font-bold text-[#2F3E46] mb-2 text-center">Приводы NICE для распашных ворот</h3>
                            <p className="text-gray-600 text-center mb-6">Надежные приводы итальянского бренда с различными комплектациями</p>
                            <ProductGrid products={niceProducts} onProductClick={setSelectedProduct} />
                        </>
                    )}
                    {activeTab === 'alutech' && (
                        <>
                            <h3 className="text-2xl font-bold text-[#2F3E46] mb-2 text-center">Приводы Alutech для распашных ворот</h3>
                            <p className="text-gray-600 text-center mb-6">Качественные приводы белорусского производителя с гарантией</p>
                            <ProductGrid products={alutechProducts} onProductClick={setSelectedProduct} />
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
                            Готовы заказать автоматику для распашных ворот?
                        </h2>
                        <p className="text-lg text-gray-600 mb-8">
                            Оставьте заявку на бесплатную консультацию, и наш специалист поможет подобрать идеальный привод под параметры ваших ворот
                        </p>
                        <Button 
                            size="lg" 
                            className="cta-button-primary" 
                            onClick={() => openModal({
                                scope: 'consultation',
                                title: 'Консультация по выбору',
                                subtitle: 'Наш специалист поможет подобрать идеальный привод под параметры ваших ворот',
                            })}
                        >
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
                            <img draggable={false}
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
                            <img draggable={false}
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
